import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePapelDto, UpdatePapelDto } from './dto/create-papel.dto';
import { ALL_PERMISSIONS, PERMISSIONS } from '../common/constants/permissions';

@Injectable()
export class RbacService {
    constructor(private prisma: PrismaService) { }

    async listPermissions() {
        // Return list of available permissions with description
        return this.prisma.permissao.findMany({
            orderBy: { chave: 'asc' }
        });
    }

    async createPapel(id_tenant: string, dto: CreatePapelDto) {
        return this.prisma.papel.create({
            data: {
                nome: dto.nome,
                id_tenant,
                permissoes: {
                    create: dto.permissoes.map(p => ({
                        permissao: { connect: { chave: p } }
                    }))
                }
            },
            include: { permissoes: { include: { permissao: true } } }
        });
    }

    async findAllPapeis(id_tenant: string) {
        return this.prisma.papel.findMany({
            where: { id_tenant },
            include: {
                permissoes: { include: { permissao: true } },
                _count: { select: { usuarios: true } }
            },
            orderBy: { nome: 'asc' }
        });
    }

    async findOnePapel(id_tenant: string, id: string) {
        const papel = await this.prisma.papel.findFirst({
            where: { id, id_tenant },
            include: { permissoes: { include: { permissao: true } } }
        });
        if (!papel) throw new NotFoundException('Papel não encontrado');
        return papel;
    }

    async updatePapel(id_tenant: string, id: string, dto: UpdatePapelDto) {
        await this.findOnePapel(id_tenant, id);

        return this.prisma.$transaction(async (tx) => {
            // Update name
            await tx.papel.update({
                where: { id },
                data: { nome: dto.nome }
            });

            // Update permissions (Replace strategy)
            if (dto.permissoes) {
                await tx.papelPermissao.deleteMany({ where: { id_papel: id } });

                for (const p of dto.permissoes) {
                    const permissao = await tx.permissao.findUnique({ where: { chave: p } });
                    if (permissao) {
                        await tx.papelPermissao.create({
                            data: {
                                id_papel: id,
                                id_permissao: permissao.id
                            }
                        });
                    }
                }
            }

            return tx.papel.findUnique({
                where: { id },
                include: { permissoes: { include: { permissao: true } } }
            });
        });
    }

    async deletePapel(id_tenant: string, id: string) {
        const papel = await this.findOnePapel(id_tenant, id);

        // Check if assigned to users
        const usersCount = await this.prisma.usuarioPapel.count({ where: { id_papel: id } });
        if (usersCount > 0) {
            throw new BadRequestException('Não é possível excluir um papel atribuído a usuários.');
        }

        return this.prisma.papel.delete({ where: { id } });
    }
}
