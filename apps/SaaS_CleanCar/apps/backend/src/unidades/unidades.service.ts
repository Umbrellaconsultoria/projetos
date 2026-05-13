import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnidadeDto, UpdateUnidadeDto } from './dto/create-unidade.dto';

@Injectable()
export class UnidadesService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, createUnidadeDto: CreateUnidadeDto) {
        return this.prisma.unidade.create({
            data: {
                ...createUnidadeDto,
                id_tenant
            }
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.unidade.findMany({
            where: { id_tenant },
            orderBy: { nome: 'asc' }
        });
    }

    async findOne(id_tenant: string, id: string) {
        const unidade = await this.prisma.unidade.findFirst({
            where: { id, id_tenant }
        });
        if (!unidade) throw new NotFoundException('Unidade não encontrada');
        return unidade;
    }

    async update(id_tenant: string, id: string, updateUnidadeDto: UpdateUnidadeDto) {
        await this.findOne(id_tenant, id); // check exists

        return this.prisma.unidade.update({
            where: { id },
            data: updateUnidadeDto
        });
    }
}
