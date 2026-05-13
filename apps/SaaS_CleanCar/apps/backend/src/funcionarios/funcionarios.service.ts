import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from './dto/create-funcionario.dto';

@Injectable()
export class FuncionariosService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateFuncionarioDto) {
        return this.prisma.funcionario.create({
            data: {
                ...dto,
                id_tenant: tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.funcionario.findMany({
            where: { id_tenant: tenantId },
            orderBy: { nome: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const funcionario = await this.prisma.funcionario.findFirst({
            where: { id, id_tenant: tenantId },
        });

        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }

        return funcionario;
    }

    async update(tenantId: string, id: string, dto: UpdateFuncionarioDto) {
        await this.findOne(tenantId, id);

        return this.prisma.funcionario.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id_tenant: string, id: string) {
        await this.findOne(id_tenant, id);
        return this.prisma.funcionario.delete({ where: { id } });
    }

    async getProductivity(id_tenant: string, dataReferencia: Date) {
        const inicio = new Date(dataReferencia);
        inicio.setHours(0, 0, 0, 0);
        const fim = new Date(dataReferencia);
        fim.setHours(23, 59, 59, 999);

        const items = await this.prisma.ordemServicoItem.findMany({
            where: {
                id_tenant,
                ordem: {
                    data: {
                        gte: inicio,
                        lte: fim
                    }
                },
                id_funcionario: { not: null }
            },
            include: {
                funcionario: true
            }
        });

        // Group by employee and sum points
        const report = items.reduce((acc, item) => {
            const funcId = item.id_funcionario!;
            if (!acc[funcId]) {
                acc[funcId] = {
                    id: funcId,
                    nome: item.funcionario?.nome || 'Desconhecido',
                    pontos: 0,
                    quantidade_servicos: 0
                };
            }
            acc[funcId].pontos += item.pontos || 0;
            acc[funcId].quantidade_servicos += 1;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(report);
    }
}
