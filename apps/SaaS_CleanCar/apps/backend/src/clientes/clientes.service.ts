import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, createClienteDto: CreateClienteDto) {
        return this.prisma.cliente.create({
            data: {
                ...createClienteDto,
                id_tenant,
            },
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.cliente.findMany({
            where: { id_tenant },
            orderBy: { nome: 'asc' },
        });
    }

    async findOne(id_tenant: string, id: string) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id, id_tenant },
            include: { veiculos: true },
        });
        if (!cliente) throw new NotFoundException('Cliente não encontrado');
        return cliente;
    }

    async update(id_tenant: string, id: string, updateClienteDto: UpdateClienteDto) {
        await this.findOne(id_tenant, id); // check exists
        return this.prisma.cliente.update({
            where: { id },
            data: updateClienteDto,
        });
    }
}
