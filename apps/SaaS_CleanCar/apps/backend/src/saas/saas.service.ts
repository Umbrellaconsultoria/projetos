import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusAssinatura, StatusFatura } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaasService {
    constructor(private prisma: PrismaService) { }

    async listarTenants() {
        return this.prisma.tenant.findMany({
            include: {
                assinatura: {
                    include: { plano: true }
                },
                _count: {
                    select: { unidades: true }
                }
            },
            orderBy: { criado_em: 'desc' }
        });
    }

    async listarFaturas() {
        return this.prisma.faturaSaaS.findMany({
            include: {
                assinatura: {
                    include: { tenant: { select: { nome_fantasia: true, cnpj: true } } }
                }
            },
            orderBy: { data_vencimento: 'asc' }
        });
    }

    async aprovarFatura(id_fatura: string) {
        // 1. Marcar fatura como paga
        const fatura = await this.prisma.faturaSaaS.update({
            where: { id: id_fatura },
            data: {
                status: 'PAGA',
                data_pagamento: new Date()
            },
            include: { assinatura: true }
        });

        // 2. Se a assinatura estava inadimplente ou em teste grátis (que expirou e aguardava pagamento), mudar para ATIVA
        if (fatura.assinatura.status !== 'ATIVA') {
            await this.prisma.assinaturaSaaS.update({
                where: { id: fatura.id_assinatura },
                data: { status: 'ATIVA' }
            });
        }

        return fatura;
    }

    async rejeitarFatura(id_fatura: string) {
        const fatura = await this.prisma.faturaSaaS.update({
            where: { id: id_fatura },
            data: {
                status: 'PENDENTE',
                url_comprovante: null,
                observacoes: 'Comprovante rejeitado pelo administrador.'
            }
        });

        // Pode-se implementar notificação de email ao tenant sobre a recusa.
        return fatura;
    }

    async mudarStatusAssinatura(id: string, status: StatusAssinatura) {
        return this.prisma.assinaturaSaaS.update({
            where: { id },
            data: { status }
        });
    }

    async mudarStatusFatura(id: string, status: StatusFatura) {
        return this.prisma.faturaSaaS.update({
            where: { id },
            data: { status }
        });
    }
}
