import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.usuario.findFirst({
        where: { email: 'admin1771464712694@test.com' },
        include: {
            tenant: true
        }
    });

    console.log("User tenant:", user?.tenant);
    console.log("Is SaaS Provider?", user?.tenant?.is_saas_provider);
}

main().finally(() => prisma.$disconnect());
