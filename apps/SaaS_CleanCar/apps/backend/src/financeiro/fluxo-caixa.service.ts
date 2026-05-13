import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AberturaCaixaDto } from './dto/abertura-caixa.dto';
import { FechamentoCaixaDto } from './dto/fechamento-caixa.dto';
import { StatusCaixa } from '@prisma/client';
import { AuditoriaService } from '../common/auditoria.service';

@Injectable()
export class FluxoCaixaService {
    constructor(
        private prisma: PrismaService,
        private auditoria: AuditoriaService
    ) { }

    // Internal method to get the raw database record
    async consultarHoje(id_tenant: string, id_unidade: string) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return this.prisma.fechamentoCaixa.findUnique({
            where: {
                id_tenant_id_unidade_data_referencia: {
                    id_tenant,
                    id_unidade,
                    data_referencia: hoje
                }
            }
        });
    }

    // Public method to get the decorated status for the UI
    async getCaixaStatus(id_tenant: string, id_unidade: string) {
        const caixa = await this.consultarHoje(id_tenant, id_unidade);

        if (!caixa) {
            return {
                status: 'FECHADO',
                saldo_atual_centavos: 0,
                faturamento_pix_centavos: 0,
                faturamento_cartao_centavos: 0,
                faturamento_outros_centavos: 0,
                faturamento_total_centavos: 0
            };
        }

        // Calculate breakdowns
        let saldoInicial = caixa.total_esperado_centavos;
        let totalDinheiro = 0;
        let totalPix = 0;
        let totalCartao = 0;
        let totalOutros = 0;

        if (caixa.status === 'ABERTO') {
            const pagamentos = await this.prisma.pagamento.findMany({
                where: {
                    id_tenant,
                    id_unidade,
                    pago_em: {
                        gte: caixa.data_referencia,
                        lt: new Date(caixa.data_referencia.getTime() + 24 * 60 * 60 * 1000)
                    },
                    estornado: false
                },
                select: {
                    forma_pagamento: true,
                    valor_centavos: true
                }
            });

            for (const p of pagamentos) {
                if (p.forma_pagamento === 'DINHEIRO') totalDinheiro += p.valor_centavos;
                else if (p.forma_pagamento === 'PIX') totalPix += p.valor_centavos;
                else if (['CARTAO_CREDITO', 'CARTAO_DEBITO'].includes(p.forma_pagamento)) totalCartao += p.valor_centavos;
                else totalOutros += p.valor_centavos;
            }
        }

        return {
            ...caixa,
            saldo_atual_centavos: saldoInicial + totalDinheiro, // Only money in drawer + initial balance
            faturamento_pix_centavos: totalPix,
            faturamento_cartao_centavos: totalCartao,
            faturamento_outros_centavos: totalOutros,
            faturamento_total_centavos: totalDinheiro + totalPix + totalCartao + totalOutros
        };
    }

    async abrirCaixa(id_tenant: string, id_unidade: string, dto: AberturaCaixaDto) {
        const hoje = dto.data_referencia ? new Date(dto.data_referencia) : new Date();
        hoje.setHours(0, 0, 0, 0);

        const existe = await this.prisma.fechamentoCaixa.findUnique({
            where: {
                id_tenant_id_unidade_data_referencia: {
                    id_tenant,
                    id_unidade,
                    data_referencia: hoje
                }
            }
        });

        if (existe) {
            if (existe.status === StatusCaixa.ABERTO) {
                throw new BadRequestException('Caixa já está aberto.');
            }

            // Re-open logic
            return this.prisma.fechamentoCaixa.update({
                where: { id: existe.id },
                data: {
                    status: StatusCaixa.ABERTO,
                    fechado_em: null,
                    total_informado_centavos: 0,
                    diferenca_centavos: 0,
                    observacoes: null
                }
            });
        }

        const saldoInicial = dto.saldo_inicial_centavos || 0;

        return this.prisma.fechamentoCaixa.create({
            data: {
                id_tenant,
                id_unidade,
                data_referencia: hoje,
                status: StatusCaixa.ABERTO,
                total_esperado_centavos: saldoInicial,
                total_informado_centavos: 0,
                diferenca_centavos: 0,
            }
        });
    }

    async fecharCaixa(id_tenant: string, id_unidade: string, dto: FechamentoCaixaDto, id_usuario: string) {
        const caixa = await this.consultarHoje(id_tenant, id_unidade);
        if (!caixa) {
            throw new NotFoundException('Nenhum caixa aberto para hoje nesta unidade.');
        }

        if (caixa.status === StatusCaixa.FECHADO) {
            throw new BadRequestException('Caixa já está fechado.');
        }

        const pagamentos = await this.prisma.pagamento.aggregate({
            where: {
                id_tenant,
                id_unidade,
                pago_em: {
                    gte: caixa.data_referencia,
                    lt: new Date(caixa.data_referencia.getTime() + 24 * 60 * 60 * 1000)
                },
                estornado: false
            },
            _sum: { valor_centavos: true }
        });

        const totalPagamentos = pagamentos._sum.valor_centavos || 0;
        const totalEsperado = caixa.total_esperado_centavos + totalPagamentos;

        const diferenca = dto.total_informado_centavos - totalEsperado;

        const fechamento = await this.prisma.fechamentoCaixa.update({
            where: { id: caixa.id },
            data: {
                status: StatusCaixa.FECHADO,
                total_esperado_centavos: totalEsperado,
                total_informado_centavos: dto.total_informado_centavos,
                diferenca_centavos: diferenca,
                observacoes: dto.observacoes,
                fechado_em: new Date()
            }
        });

        // Auditoria
        await this.auditoria.registrar(
            id_tenant,
            id_usuario,
            'FECHAR_CAIXA',
            'FechamentoCaixa',
            fechamento.id,
            { status: 'ABERTO', total_esperado: caixa.total_esperado_centavos },
            fechamento
        );

        return fechamento;
    }

    async getFaturamentoPeriodo(id_tenant: string, id_unidade: string, dataInicio: Date, dataFim: Date) {
        // Adjust end date to cover the entire day
        const fimDate = new Date(dataFim);
        fimDate.setHours(23, 59, 59, 999);

        const inicioDate = new Date(dataInicio);
        inicioDate.setHours(0, 0, 0, 0);

        const pagamentos = await this.prisma.pagamento.findMany({
            where: {
                id_tenant,
                id_unidade,
                pago_em: {
                    gte: inicioDate,
                    lte: fimDate
                },
                estornado: false
            },
            select: {
                pago_em: true,
                forma_pagamento: true,
                valor_centavos: true
            },
            orderBy: {
                pago_em: 'asc'
            }
        });

        // Group by YYYY-MM-DD
        const grouped = pagamentos.reduce((acc, p) => {
            const dateStr = p.pago_em.toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = {
                    date: dateStr,
                    PIX: 0,
                    CARTAO_CREDITO: 0,
                    CARTAO_DEBITO: 0,
                    DINHEIRO: 0,
                    OUTROS: 0,
                    TOTAL: 0
                };
            }

            const val = p.valor_centavos / 100;
            if (p.forma_pagamento === 'PIX') acc[dateStr].PIX += val;
            else if (p.forma_pagamento === 'CARTAO_CREDITO') acc[dateStr].CARTAO_CREDITO += val;
            else if (p.forma_pagamento === 'CARTAO_DEBITO') acc[dateStr].CARTAO_DEBITO += val;
            else if (p.forma_pagamento === 'DINHEIRO') acc[dateStr].DINHEIRO += val;
            else acc[dateStr].OUTROS += val;

            acc[dateStr].TOTAL += val;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(grouped);
    }
}
