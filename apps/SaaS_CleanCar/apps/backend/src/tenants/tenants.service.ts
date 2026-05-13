import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import * as bcrypt from 'bcrypt';
import { PERMISSIONS, ALL_PERMISSIONS } from '../common/constants/permissions';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) { }

    async create(createTenantDto: CreateTenantDto) {
        const {
            nome_fantasia, razao_social, cnpj, telefone,
            nome_usuario, email_usuario, senha_usuario
        } = createTenantDto;

        // Check if user email already exists (globally unique by tenant+email tuple, but for admin we might want more strict check or just try/catch)
        // Actually schema says @@unique([id_tenant, email]), so same email can exist in different tenants.
        // BUT this is a new tenant.

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(senha_usuario, salt);

        // Transaction: Tenant -> Permissions (ensure) -> Role -> User -> Assign Role
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    nome_fantasia,
                    razao_social,
                    cnpj,
                    telefone,
                },
            });

            // 1.5 Create Default Unit (Matriz)
            const unidade = await tx.unidade.create({
                data: {
                    nome: 'Matriz',
                    endereco: 'Endereço Principal',
                    id_tenant: tenant.id
                }
            });

            // 2. Ensure Permissions Exist (Upsert all)
            // Optimization: In production this should be a seed script, but for now we ensure they exist.
            // We can skip this if we assume seed ran. Let's do it safe.
            for (const perm of ALL_PERMISSIONS) {
                await tx.permissao.upsert({
                    where: { chave: perm },
                    update: {},
                    create: { chave: perm, descricao: perm.replace(/_/g, ' ') },
                });
            }

            // 3. Create 'Admin' Role for this Tenant
            const adminRole = await tx.papel.create({
                data: {
                    nome: 'Administrador',
                    id_tenant: tenant.id,
                    permissoes: {
                        create: ALL_PERMISSIONS.map((perm) => ({
                            permissao: { connect: { chave: perm } },
                        })),
                    },
                },
            });

            // 4. Create User
            const user = await tx.usuario.create({
                data: {
                    nome: nome_usuario,
                    email: email_usuario,
                    senha_hash: hashedPassword,
                    id_tenant: tenant.id,
                    papeis: {
                        create: {
                            papel: { connect: { id: adminRole.id } },
                        },
                    },
                },
            });

            return {
                tenant,
                user: { id: user.id, nome: user.nome, email: user.email },
            };
        });
    }

    async findAll() {
        return this.prisma.tenant.findMany();
    }

    async findOne(id: string) {
        return this.prisma.tenant.findUnique({ where: { id } });
    }

    async updateLogoUrl(id: string, logo_url: string) {
        return this.prisma.tenant.update({
            where: { id },
            data: { logo_url }
        });
    }
}
