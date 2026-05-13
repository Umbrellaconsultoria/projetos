const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOS() {
    try {
        console.log('Fetching the latest OS...');
        const os = await prisma.ordemServico.findFirst({
            orderBy: { criado_em: 'desc' },
            include: {
                itens: {
                    include: {
                        servico: true,
                        funcionario: true
                    }
                }
            }
        });

        if (!os) {
            console.log('No OS found');
            return;
        }

        console.log(`OS ID: ${os.id}`);
        console.log('Itens data:');
        console.log(JSON.stringify(os.itens, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkOS();
