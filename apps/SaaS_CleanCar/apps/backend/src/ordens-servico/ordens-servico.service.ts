import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdemServicoDto } from './dto/create-ordem-servico.dto';
// import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { StatusOS } from '@prisma/client';
import PDFDocument from 'pdfkit';

@Injectable()
export class OrdensServicoService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, dto: CreateOrdemServicoDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Resolve Vehicle and Client
            let veiculo = await tx.veiculo.findUnique({
                where: { id_tenant_placa: { id_tenant, placa: dto.placa } },
                include: { cliente: true },
            });

            if (!veiculo) {
                if (!dto.veiculo || !dto.cliente) {
                    throw new BadRequestException('Veículo não encontrado. Informe dados de veículo e cliente para cadastro (Placa nova).');
                }

                const cliente = await tx.cliente.create({
                    data: {
                        nome: dto.cliente.nome,
                        telefone: dto.cliente.telefone,
                        id_tenant,
                    },
                });

                veiculo = await tx.veiculo.create({
                    data: {
                        placa: dto.placa,
                        modelo: dto.veiculo.modelo,
                        porte: dto.veiculo.porte,
                        id_cliente: cliente.id,
                        id_tenant,
                    },
                    include: { cliente: true },
                });
            }

            // 2. Calculate Total & Prepare Items
            let totalCentavos = 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const itensToCreate: any[] = [];

            if (dto.itens && dto.itens.length > 0) {
                for (const itemDto of dto.itens) {
                    // Fetch service with prices
                    const servico = await tx.servico.findUnique({
                        where: { id: itemDto.id_servico },
                        include: { precos: true }
                    });

                    if (!servico) throw new NotFoundException(`Serviço ${itemDto.id_servico} não encontrado`);

                    const precoRegistro = servico.precos.find(p => p.porte === itemDto.porte);

                    if (!precoRegistro) {
                        throw new BadRequestException(`Preço não cadastrado para o serviço ${servico.nome} no porte ${itemDto.porte}`);
                    }

                    const valorCentavos = precoRegistro.valor_centavos;
                    totalCentavos += valorCentavos;

                    itensToCreate.push({
                        id_tenant,
                        id_servico: servico.id,
                        id_funcionario: itemDto.id_funcionario || undefined, // Transform empty string to undefined
                        porte: itemDto.porte,
                        valor_centavos: valorCentavos,
                        quantidade: 1, // Default 1 for now
                        pontos: servico.pontos // Capture current points for history
                    });
                }
            }

            // Process Combo if present
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let comboToCreate: any = undefined;
            if (dto.id_combo) {
                const combo = await tx.combo.findUnique({
                    where: { id: dto.id_combo },
                    include: { precos: true }
                });

                if (!combo) throw new NotFoundException(`Combo ${dto.id_combo} não encontrado`);
                if (!combo.ativo) throw new BadRequestException(`Combo ${combo.nome} está inativo`);

                const precoRegistro = combo.precos.find(p => p.porte === veiculo.porte);

                if (!precoRegistro) {
                    throw new BadRequestException(`Preço não cadastrado para o combo ${combo.nome} no porte ${veiculo.porte}`);
                }

                totalCentavos += precoRegistro.valor_centavos;
                comboToCreate = {
                    create: {
                        id_tenant,
                        id_combo: combo.id,
                        porte: veiculo.porte,
                        valor_centavos: precoRegistro.valor_centavos
                    }
                };
            }

            // 3. Create OS
            const dataAbertura = dto.data ? new Date(dto.data) : new Date();
            const unidade = await tx.unidade.findFirst({ where: { id_tenant } });
            if (!unidade) throw new BadRequestException('Nenhuma unidade encontrada para este tenant.');

            const os = await tx.ordemServico.create({
                data: {
                    id_tenant,
                    id_unidade: unidade.id,
                    id_cliente: veiculo.id_cliente,
                    id_veiculo: veiculo.id,
                    status: StatusOS.ABERTA,
                    total_centavos: totalCentavos,
                    data: dataAbertura,
                    prazo: dto.prazo,
                    observacoes: dto.observacoes,
                    pertence_valor: dto.pertence_valor || false,
                    descricao_pertences: dto.descricao_pertences,
                    itens: {
                        create: itensToCreate
                    },
                    combo: comboToCreate
                },
                include: { itens: true, combo: true }
            });

            return os;
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.ordemServico.findMany({
            where: { id_tenant },
            include: {
                cliente: true,
                veiculo: true,
                itens: true,
                combo: true
            },
            orderBy: { data: 'desc' },
        });
    }

    async findOne(id_tenant: string, id: string) {
        const os = await this.prisma.ordemServico.findFirst({
            where: { id, id_tenant },
            include: {
                cliente: true,
                veiculo: true,
                itens: {
                    include: {
                        funcionario: true // There's no servico relation in schema, so we keep only funcionario
                    }
                },
                combo: true,
                pagamentos: true
            },
        });

        if (!os) throw new NotFoundException('OS não encontrada');

        // Manually fetch services to populate nomes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceIds = [...new Set(os.itens.map((i: any) => i.id_servico))];
        const services = await this.prisma.servico.findMany({
            where: { id: { in: serviceIds as string[] } }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceMap = new Map(services.map((s: any) => [s.id, s]));

        // Manually fetch combo if present
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let comboDetalhado: any = null;
        if (os.combo) {
            comboDetalhado = await this.prisma.combo.findUnique({
                where: { id: os.combo.id_combo }
            });
        }

        // Inject servico object into itens
        const osWithServices = {
            ...os,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            itens: os.itens.map((item: any) => ({
                ...item,
                servico: serviceMap.get(item.id_servico) || { nome: 'Serviço Desconhecido' }
            })),
            combo: os.combo ? { ...os.combo, combo: comboDetalhado } : null
        };

        return osWithServices;
    }

    async updateStatus(id_tenant: string, id: string, status: StatusOS) {
        const os = await this.prisma.ordemServico.findFirst({ where: { id, id_tenant } });
        if (!os) throw new NotFoundException('OS não encontrada');

        return this.prisma.ordemServico.update({
            where: { id },
            data: { status }
        });
    }

    async generatePdf(id_tenant: string, id: string): Promise<Buffer> {
        const os = await this.findOne(id_tenant, id);
        const tenant = await this.prisma.tenant.findUnique({ where: { id: id_tenant } });

        // Buscar nomes dos serviços manualmente pois o include não resolve nomes se não houver relação direta no schema
        // Coletar IDs únicos de serviços
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceIds = [...new Set(os.itens.map((i: any) => i.id_servico))];
        const services = await this.prisma.servico.findMany({
            where: { id: { in: serviceIds as string[] } }
        });
        // Mapa de ID -> Nome
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serviceMap = new Map(services.map((s: any) => [s.id, s.nome]));

        return new Promise((resolve) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', (buffer) => buffers.push(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffers);
                resolve(data);
            });

            // --- Cabeçalho ---
            doc.fontSize(20).text(tenant?.nome_fantasia || 'CleanCar SaaS', { align: 'center' });
            doc.fontSize(12).text(`Ordem de Serviço #${os.id.split('-')[0].toUpperCase()}`, { align: 'center' });
            doc.moveDown();

            // --- Dados do Cliente e Veículo ---
            doc.fontSize(12).font('Helvetica-Bold').text('Dados do Cliente:');
            doc.font('Helvetica').text(`Nome: ${os.cliente.nome}`);
            doc.text(`Telefone: ${os.cliente.telefone || 'N/A'}`);
            doc.moveDown(0.5);

            doc.font('Helvetica-Bold').text('Dados do Veículo:');
            doc.font('Helvetica').text(`Modelo: ${os.veiculo.modelo} - Placa: ${os.veiculo.placa}`);
            doc.text(`Porte: ${os.veiculo.porte}`);
            doc.moveDown();

            // --- Itens do Serviço ---
            doc.fontSize(14).font('Helvetica-Bold').text('Serviços:', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            os.itens.forEach((item: any) => {
                const nomeServico = serviceMap.get(item.id_servico) || 'Serviço desconhecido';
                const valor = (item.valor_centavos / 100).toFixed(2);
                doc.font('Helvetica').text(`- ${nomeServico} (${item.porte}): R$ ${valor}`);
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((os as any).combo) {
                const comboOs = (os as any).combo;
                const valorCombo = (comboOs.valor_centavos / 100).toFixed(2);
                doc.font('Helvetica').text(`- [COMBO] ${comboOs.combo?.nome || 'Combo'} (${comboOs.porte}): R$ ${valorCombo}`);
            }

            doc.moveDown();
            doc.font('Helvetica-Bold').text(`Total: R$ ${(os.total_centavos / 100).toFixed(2)}`, { align: 'right' });

            if (os.observacoes) {
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Observações:');
                doc.font('Helvetica').text(os.observacoes);
            }

            doc.end();
        });
    }
}
