import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaturasService {
    constructor(private prisma: PrismaService) { }

    async findAllByTenant(id_tenant: string) {
        return this.prisma.faturaSaaS.findMany({
            where: {
                assinatura: {
                    id_tenant: id_tenant
                }
            },
            orderBy: [
                { ano_referencia: 'desc' },
                { mes_referencia: 'desc' }
            ]
        });
    }

    async enviarComprovante(id_fatura: string, id_tenant: string, url_comprovante: string) {
        const fatura = await this.prisma.faturaSaaS.findUnique({
            where: { id: id_fatura },
            include: { assinatura: true }
        });

        if (!fatura || fatura.assinatura.id_tenant !== id_tenant) {
            throw new NotFoundException('Fatura não encontrada.');
        }

        if (fatura.status === 'PAGA') {
            throw new BadRequestException('Esta fatura já está paga.');
        }

        return this.prisma.faturaSaaS.update({
            where: { id: id_fatura },
            data: {
                url_comprovante,
                status: 'EM_ANALISE'
            }
        });
    }
}
