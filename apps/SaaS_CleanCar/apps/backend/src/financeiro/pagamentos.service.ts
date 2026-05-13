import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { FluxoCaixaService } from './fluxo-caixa.service';

@Injectable()
export class PagamentosService {
    constructor(
        private prisma: PrismaService,
        private fluxoCaixaService: FluxoCaixaService
    ) { }

    async registrarPagamento(id_tenant: string, dto: RegistrarPagamentoDto) {
        // 1. Buscar OS para validar
        const os = await this.prisma.ordemServico.findUnique({
            where: { id: dto.id_ordem_servico }
        });

        if (!os) throw new NotFoundException('Ordem de Serviço não encontrada.');
        if (os.id_tenant !== id_tenant) throw new BadRequestException('OS de outro tenant.');

        // Unidade do pagamento: DTO (prioridade) ou OS
        const id_unidade = dto.id_unidade || os.id_unidade;

        // 2. Validar Caixa Aberto
        const caixa = await this.fluxoCaixaService.consultarHoje(id_tenant, id_unidade);
        if (!caixa || caixa.status !== 'ABERTO') {
            throw new BadRequestException('Caixa fechado ou não aberto para esta unidade hoje. Abra o caixa antes de receber.');
        }

        // 3. Registrar Pagamento
        const pagamento = await this.prisma.pagamento.create({
            data: {
                id_tenant,
                id_unidade,
                id_ordem_servico: os.id,
                forma_pagamento: dto.forma_pagamento,
                valor_centavos: dto.valor_centavos,
            }
        });

        return pagamento;
    }

    async listarPorOS(id_tenant: string, id_ordem_servico: string) {
        return this.prisma.pagamento.findMany({
            where: { id_tenant, id_ordem_servico },
            orderBy: { pago_em: 'desc' }
        });
    }
}
