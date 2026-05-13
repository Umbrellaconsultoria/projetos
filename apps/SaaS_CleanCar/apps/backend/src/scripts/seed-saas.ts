import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding SaaS Data...');

    // 1. Criar plano base
    let plano = await prisma.planoSaaS.findFirst();
    if (!plano) {
        plano = await prisma.planoSaaS.create({
            data: {
                nome: 'Plano Pro 2026',
                valor_mensalidade: 19990, // R$ 199,90
                valor_por_filial: 4990,   // R$ 49,90 extra por filial
            }
        });
        console.log('Plano SaaS criado.');
    }

    // 2. Pegar todos os Tenants
    const tenants = await prisma.tenant.findMany();

    // Opcional: fazer o primeiro tenant ser o saas_provider
    if (tenants.length > 0) {
        await prisma.tenant.update({
            where: { id: tenants[0].id },
            data: { is_saas_provider: true }
        });
        console.log(`Tenant ${tenants[0].nome_fantasia} agora é o provedor do SaaS.`);
    }

    for (const t of tenants) {
        let assinatura = await prisma.assinaturaSaaS.findUnique({ where: { id_tenant: t.id } });

        if (!assinatura) {
            const dataInicio = new Date();
            const dataFimTrial = new Date();
            dataFimTrial.setDate(dataInicio.getDate() + 15);

            assinatura = await prisma.assinaturaSaaS.create({
                data: {
                    id_tenant: t.id,
                    id_plano: plano.id,
                    status: 'TESTE_GRATIS',
                    data_inicio: dataInicio,
                    data_fim_trial: dataFimTrial,
                    dia_vencimento: 5
                }
            });
            console.log(`Assinatura criada para ${t.nome_fantasia}.`);

            // Gerar a primeira fatura Pendente para testes
            await prisma.faturaSaaS.create({
                data: {
                    id_assinatura: assinatura.id,
                    mes_referencia: dataInicio.getMonth() + 1,
                    ano_referencia: dataInicio.getFullYear(),
                    valor_total: plano.valor_mensalidade, // Simplificado, sem calc de filiais no seed
                    data_vencimento: new Date(dataInicio.getFullYear(), dataInicio.getMonth() + 1, 5),
                    status: 'PENDENTE'
                }
            });
            console.log(`Fatura inicial gerada para ${t.nome_fantasia}.`);
        }
    }

    console.log('Feito!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
