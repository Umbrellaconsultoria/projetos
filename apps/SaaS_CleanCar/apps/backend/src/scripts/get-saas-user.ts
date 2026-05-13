import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const tenants = await prisma.tenant.findMany({
        where: { is_saas_provider: true },
        include: { usuarios: { select: { email: true, nome: true } } }
    });
    console.log(JSON.stringify(tenants, null, 2));
}

main().finally(() => prisma.$disconnect());
