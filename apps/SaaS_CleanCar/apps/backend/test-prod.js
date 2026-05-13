const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProductivity() {
    try {
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) return console.log('No tenant found');

        const hoje = new Date();
        const inicio = new Date(hoje);
        inicio.setHours(0, 0, 0, 0);
        const fim = new Date(hoje);
        fim.setHours(23, 59, 59, 999);

        const items = await prisma.ordemServicoItem.findMany({
            where: {
                id_tenant: tenant.id,
                ordem: {
                    data: {
                        gte: inicio,
                        lte: fim
                    }
                },
                id_funcionario: { not: null }
            },
            include: {
                funcionario: true,
                ordem: true
            }
        });

        console.log(`Found ${items.length} items for today.`);
        for (const item of items) {
            console.log(`- OS: ${item.ordem.status}, Func: ${item.funcionario.nome}, Pontos Item: ${item.pontos}, Valor: ${item.valor_centavos}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkProductivity();
