const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProductivity() {
    try {
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) return console.log('No tenant found');

        const items = await prisma.ordemServicoItem.findMany({
            where: {
                id_tenant: tenant.id,
                id_funcionario: { not: null }
            },
            include: {
                funcionario: true,
                ordem: true
            }
        });

        console.log(`Found ${items.length} items WITH Employee assigned in TOTAL.`);
        for (const item of items) {
            console.log(`- Data: ${item.ordem.data}, OS: ${item.ordem.status}, Func: ${item.funcionario.nome}, Pontos: ${item.pontos}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkProductivity();
