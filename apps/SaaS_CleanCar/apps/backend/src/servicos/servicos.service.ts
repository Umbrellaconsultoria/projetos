import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicosService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, createServicoDto: CreateServicoDto) {
        const { precos, ...servicoData } = createServicoDto;

        return this.prisma.servico.create({
            data: {
                ...servicoData,
                id_tenant,
                precos: {
                    create: precos.map(p => ({
                        id_tenant,
                        porte: p.porte,
                        valor_centavos: p.valor_centavos
                    }))
                }
            },
            include: { precos: true }
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.servico.findMany({
            where: { id_tenant },
            include: { precos: true },
            orderBy: { nome: 'asc' },
        });
    }

    async findOne(id_tenant: string, id: string) {
        const servico = await this.prisma.servico.findFirst({
            where: { id, id_tenant },
            include: { precos: true },
        });
        if (!servico) throw new NotFoundException('Serviço não encontrado');
        return servico;
    }

    async update(id_tenant: string, id: string, updateServicoDto: UpdateServicoDto) {
        await this.findOne(id_tenant, id); // check exists

        // Separate precos from other data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { precos, ...data } = updateServicoDto;

        // Update basic fields
        const servico = await this.prisma.servico.update({
            where: { id },
            data: data,
        });

        // Handle prices update if provided
        if (precos) {
            // Simplest strategy: delete all and recreate, or upsert.
            // Upsert is better but strictly speaking we might want to just replace.
            // Let's use delete Many and create Many for simplicity of logic here, or Transaction.
            await this.prisma.$transaction(async (tx) => {
                await tx.servicoPreco.deleteMany({
                    where: { id_tenant, id_servico: id }
                });
                if (precos.length > 0) {
                    await tx.servicoPreco.createMany({
                        data: precos.map(p => ({
                            id_tenant,
                            id_servico: id,
                            porte: p.porte,
                            valor_centavos: p.valor_centavos
                        }))
                    });
                }
            });
        }

        return this.findOne(id_tenant, id);
    }
}
