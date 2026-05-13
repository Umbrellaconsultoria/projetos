import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const res = await prisma.tenant.updateMany({
        data: { is_saas_provider: true }
    });
    console.log("Atualizados:", res.count);

    const count = await prisma.tenant.count({ where: { is_saas_provider: true } });
    console.log("Tenants provedores agora:", count);
}
main();
