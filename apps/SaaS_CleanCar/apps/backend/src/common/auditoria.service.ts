import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditoriaService {
    constructor(private prisma: PrismaService) { }

    async registrar(
        id_tenant: string,
        id_usuario: string, // Obrigado a passar string
        acao: string,
        entidade: string,
        id_registro: string,
        antes_json?: any,
        depois_json?: any,
    ) {
        if (!id_usuario) return;

        await this.prisma.logAuditoria.create({
            data: {
                id_tenant,
                id_usuario,
                acao,
                entidade,
                id_registro,
                antes_json: antes_json ? (antes_json as Prisma.InputJsonValue) : Prisma.JsonNull,
                depois_json: depois_json ? (depois_json as Prisma.InputJsonValue) : Prisma.JsonNull,
            },
        });
    }
}
