const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPermissions() {
    try {
        console.log('Ensure GERENCIAR_FUNCIONARIOS permission exists...');
        const perm = await prisma.permissao.upsert({
            where: { chave: 'gerenciar_funcionarios' },
            create: { chave: 'gerenciar_funcionarios', descricao: 'Permissão para gerenciar o cadastro e relatórios dos funcionários' },
            update: {}
        });

        console.log('Checking Tenant Roles to grant permission to Admin roles...');

        // Find all roles
        const roles = await prisma.papel.findMany({
            include: {
                permissoes: true
            }
        });

        const criarUsuarioId = await getPermId('criar_usuario');

        for (const role of roles) {
            const isAdmin = role.nome.toLowerCase().includes('admin');
            const hasUserAccess = role.permissoes.some(p => p.id_permissao === criarUsuarioId);

            if (isAdmin || hasUserAccess) {
                console.log(`Granting to role: ${role.nome}`);
                // Link permission
                await prisma.papelPermissao.upsert({
                    where: {
                        id_papel_id_permissao: {
                            id_papel: role.id,
                            id_permissao: perm.id
                        }
                    },
                    create: {
                        id_papel: role.id,
                        id_permissao: perm.id
                    },
                    update: {}
                });
            }
        }

        console.log('Fixed correctly!');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

async function getPermId(chave) {
    const p = await prisma.permissao.findUnique({ where: { chave } });
    return p ? p.id : 'none';
}

fixPermissions();
