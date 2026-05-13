import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Injectable()
export class VeiculosService {
    constructor(private prisma: PrismaService) { }

    async create(id_tenant: string, createVeiculoDto: CreateVeiculoDto) {
        return this.prisma.veiculo.create({
            data: {
                ...createVeiculoDto,
                id_tenant,
            },
        });
    }

    async findAll(id_tenant: string) {
        return this.prisma.veiculo.findMany({
            where: { id_tenant },
            include: { cliente: true },
        });
    }

    async findOne(id_tenant: string, id: string) {
        const veiculo = await this.prisma.veiculo.findFirst({
            where: { id, id_tenant },
            include: { cliente: true },
        });
        if (!veiculo) throw new NotFoundException('Veículo não encontrado');
        return veiculo;
    }

    async update(id_tenant: string, id: string, updateVeiculoDto: UpdateVeiculoDto) {
        await this.findOne(id_tenant, id);
        return this.prisma.veiculo.update({
            where: { id },
            data: updateVeiculoDto,
        });
    }

    async findByPlaca(id_tenant: string, placa: string) {
        return this.prisma.veiculo.findUnique({
            where: { id_tenant_placa: { id_tenant, placa } },
        });
    }
}
