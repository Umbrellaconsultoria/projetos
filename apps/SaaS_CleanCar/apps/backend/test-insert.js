const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAndCheck() {
    try {
        console.log('Finding a tenant...');
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) return console.log('No tenant found');

        console.log('Finding a Funcionario...');
        let func = await prisma.funcionario.findFirst({ where: { id_tenant: tenant.id } });
        if (!func) {
            console.log('Creating a dummy Funcionario...');
            func = await prisma.funcionario.create({
                data: {
                    id_tenant: tenant.id,
                    nome: 'Test Worker',
                    ativo: true
                }
            });
        }

        console.log('Finding a Servico...');
        let servico = await prisma.servico.findFirst({ where: { id_tenant: tenant.id } });
        if (!servico) return console.log('No service found');

        console.log('Finding an OS to attach this to...');
        const os = await prisma.ordemServico.findFirst({
            where: { id_tenant: tenant.id },
            include: { itens: true }
        });

        if (!os) return console.log('No OS found');

        console.log(`Adding an item to OS ${os.id}...`);

        await prisma.ordemServicoItem.create({
            data: {
                id_tenant: tenant.id,
                id_ordem_servico: os.id,
                id_servico: servico.id,
                id_funcionario: func.id, // THE CRITICAL PART!
                porte: 'HATCH_SEDAN',
                valor_centavos: 2500,
                quantidade: 1,
                pontos: 15
            }
        });

        console.log('Item created. Fetching OS again...');
        const updatedOs = await prisma.ordemServico.findFirst({
            where: { id: os.id },
            include: {
                itens: {
                    include: {
                        funcionario: true // DOES Prisma return the Employee?
                    }
                }
            }
        });

        console.log('Updated OS Itens:');
        console.log(JSON.stringify(updatedOs.itens, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

createAndCheck();
