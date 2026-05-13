const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPermissions() {
    try {
        console.log('--- Checking GERENCIAR_FUNCIONARIOS Permission ---');
        const perm = await prisma.permissao.findUnique({
            where: { chave: 'gerenciar_funcionarios' },
            include: {
                papeis: {
                    include: {
                        papel: {
                            include: {
                                usuarios: {
                                    include: {
                                        usuario: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!perm) {
            console.log('Permission GERENCIAR_FUNCIONARIOS does not exist in DB!');
            return;
        }

        console.log('Permission found. Roles linked to it:');
        if (perm.papeis.length === 0) {
            console.log('  -> NONE. No role has this permission.');
        } else {
            for (const pp of perm.papeis) {
                console.log(`  - Role: ${pp.papel.nome}`);
                const users = pp.papel.usuarios.map(u => u.usuario.email).join(', ');
                console.log(`    Users with this role: ${users || 'None'}`);
            }
        }

        console.log('\n--- Checking all users and their roles ---');
        const users = await prisma.usuario.findMany({
            include: {
                papeis: {
                    include: {
                        papel: true
                    }
                }
            }
        });

        for (const u of users) {
            console.log(`User: ${u.email}`);
            const roles = u.papeis.map(p => p.papel.nome).join(', ');
            console.log(`  Roles: ${roles || 'None'}`);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkPermissions();
