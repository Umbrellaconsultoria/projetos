import { PrismaClient } from '@prisma/client';
import { ALL_PERMISSIONS } from '../common/constants/permissions';

const prisma = new PrismaClient();

async function main() {
    for (const perm of ALL_PERMISSIONS) {
        await prisma.permissao.upsert({
            where: { chave: perm },
            update: {},
            create: { chave: perm, descricao: perm.replace(/_/g, ' ') },
        });
    }

    const admins = await prisma.papel.findMany({ where: { nome: 'Administrador' } });
    for (const admin of admins) {
        for (const perm of ALL_PERMISSIONS) {
            const p = await prisma.permissao.findUnique({ where: { chave: perm } });
            if (p) {
                const exists = await prisma.papelPermissao.findUnique({
                    where: { id_papel_id_permissao: { id_papel: admin.id, id_permissao: p.id } }
                });
                if (!exists) {
                    console.log(`Adding ${perm} to ${admin.id}`);
                    await prisma.papelPermissao.create({
                        data: { id_papel: admin.id, id_permissao: p.id }
                    });
                }
            }
        }
    }
    console.log('Permissions synced.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
