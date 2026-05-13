import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) { }

    async findAll(id_tenant: string) {
        return this.prisma.usuario.findMany({
            where: { id_tenant },
            include: {
                papeis: {
                    include: { papel: true }
                }
            },
            orderBy: { nome: 'asc' }
        });
    }

    async create(id_tenant: string, data: any) {
        const { papeisIds, senha, ...rest } = data;
        const senha_hash = await bcrypt.hash(senha, 10);

        return this.prisma.usuario.create({
            data: {
                ...rest,
                senha_hash,
                id_tenant,
                papeis: papeisIds && papeisIds.length > 0 ? {
                    create: papeisIds.map((id_papel: string) => ({
                        id_papel,
                        // id_usuario will be auto-filled
                    }))
                } : undefined
            },
            include: {
                papeis: { include: { papel: true } }
            }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.usuario.findFirst({
            where: { email },
            include: {
                papeis: {
                    include: {
                        papel: {
                            include: {
                                permissoes: {
                                    include: {
                                        permissao: true
                                    }
                                }
                            }
                        }
                    }
                },
                tenant: true
            }
        });
    }

    async findById(id_tenant: string, id: string) {
        return this.prisma.usuario.findFirst({
            where: { id, id_tenant },
            include: {
                papeis: { include: { papel: true } }
            }
        });
    }

    async update(id_tenant: string, id: string, data: any) {
        const { papeisIds, senha, ...rest } = data;

        let updateData: any = { ...rest };
        if (senha) {
            updateData.senha_hash = await bcrypt.hash(senha, 10);
        }

        if (papeisIds !== undefined) {
            await this.prisma.usuarioPapel.deleteMany({
                where: { id_usuario: id }
            });

            if (papeisIds.length > 0) {
                updateData.papeis = {
                    create: papeisIds.map((id_papel: string) => ({
                        id_papel
                    }))
                };
            }
        }

        return this.prisma.usuario.update({
            where: { id },
            data: updateData
        });
    }
}
