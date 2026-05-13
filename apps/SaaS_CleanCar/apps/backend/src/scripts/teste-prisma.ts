import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const t = await prisma.tenant.findMany({
            include: {
                assinatura: { include: { plano: true } },
                _count: { select: { unidades: true } }
            }
        });
        console.log('Sucesso tenants', t.length);
        const f = await prisma.faturaSaaS.findMany({
            include: {
                assinatura: { include: { tenant: { select: { nome_fantasia: true, cnpj: true } } } }
            }
        });
        console.log('Sucesso faturas', f.length);
    } catch (e) {
        console.error('ERRO PRISMA:', e);
    }
}
main().finally(() => prisma.$disconnect());
