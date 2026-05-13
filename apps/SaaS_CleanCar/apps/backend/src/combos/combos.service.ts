import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComboDto, UpdateComboDto } from './dto/create-combo.dto';

@Injectable()
export class CombosService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, createComboDto: CreateComboDto) {
        const { itens_ids, precos, ...data } = createComboDto;

        return this.prisma.combo.create({
            data: {
                ...data,
                id_tenant,
                itens: {
                    create: itens_ids.map(id_servico => ({
                        id_tenant,
                        id_servico
                    }))
                },
                precos: {
                    create: precos.map(p => ({
                        id_tenant,
                        porte: p.porte,
                        valor_centavos: p.valor_centavos
                    }))
                }
            },
            include: { itens: { include: { servico: true } }, precos: true }
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.combo.findMany({
            where: { id_tenant },
            include: { itens: { include: { servico: true } }, precos: true },
            orderBy: { nome: 'asc' }
        });
    }

    async findOne(id_tenant: string, id: string) {
        const combo = await this.prisma.combo.findFirst({
            where: { id, id_tenant },
            include: { itens: { include: { servico: true } }, precos: true }
        });
        if (!combo) throw new NotFoundException('Combo não encontrado');
        return combo;
    }

    async update(id_tenant: string, id: string, updateComboDto: UpdateComboDto) {
        await this.findOne(id_tenant, id);

        const { itens_ids, precos, ...data } = updateComboDto;

        return this.prisma.$transaction(async (tx) => {
            // Update basic info
            await tx.combo.update({
                where: { id },
                data: data
            });

            // Update items if provided (Replace strategy)
            if (itens_ids) {
                await tx.comboItem.deleteMany({ where: { id_combo: id } });
                await tx.comboItem.createMany({
                    data: itens_ids.map(id_servico => ({
                        id_tenant,
                        id_combo: id,
                        id_servico
                    }))
                });
            }

            // Update prices if provided (Replace strategy)
            if (precos) {
                await tx.comboPreco.deleteMany({ where: { id_combo: id } });
                await tx.comboPreco.createMany({
                    data: precos.map(p => ({
                        id_tenant,
                        id_combo: id,
                        porte: p.porte,
                        valor_centavos: p.valor_centavos
                    }))
                });
            }

            return tx.combo.findUnique({
                where: { id },
                include: { itens: { include: { servico: true } }, precos: true }
            });
        });
    }
}
