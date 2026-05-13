import { Controller, Get, Post, Body, Query, BadRequestException, Req } from '@nestjs/common';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { AberturaCaixaDto } from './dto/abertura-caixa.dto';
import { FechamentoCaixaDto } from './dto/fechamento-caixa.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import { PrismaService } from '../prisma/prisma.service';

@Controller('financeiro/fluxo-caixa')
export class FluxoCaixaController {
    constructor(
        private readonly fluxoCaixaService: FluxoCaixaService,
        private readonly prisma: PrismaService
    ) { }

    private async resolveUnidade(id_tenant: string, id_unidade_param?: string): Promise<string> {
        if (id_unidade_param) return id_unidade_param;
        const unidade = await this.prisma.unidade.findFirst({ where: { id_tenant } });
        if (!unidade) throw new BadRequestException('Nenhuma unidade encontrada para este tenant.');
        return unidade.id;
    }

    @Get('hoje')
    @Permissoes(PERMISSIONS.VISUALIZAR_FINANCEIRO)
    async consultarHoje(@TenantId() tenantId: string, @Query('id_unidade') idUnidade?: string) {
        const id_unidade = await this.resolveUnidade(tenantId, idUnidade);
        return this.fluxoCaixaService.getCaixaStatus(tenantId, id_unidade);
    }

    @Post('abrir')
    @Permissoes(PERMISSIONS.ABRIR_CAIXA)
    async abrirCaixa(@TenantId() tenantId: string, @Body() dto: AberturaCaixaDto, @Query('id_unidade') idUnidade?: string) {
        const id_unidade = await this.resolveUnidade(tenantId, idUnidade);
        return this.fluxoCaixaService.abrirCaixa(tenantId, id_unidade, dto);
    }

    @Post('fechar')
    @Permissoes(PERMISSIONS.FECHAR_CAIXA)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fecharCaixa(@TenantId() tenantId: string, @Body() dto: FechamentoCaixaDto, @Query('id_unidade') idUnidade?: string, @Req() req?: any) {
        const id_unidade = await this.resolveUnidade(tenantId, idUnidade);
        // User vem do AuthGuard que popula req.user. userId é o ID.
        // Se não tiver auth (ex: teste sem guard), falha ou fallback. Guard é global então user existe.
        // req.user = payload JWT: { userId, email, id_tenant, ... }
        const id_usuario = req?.user?.userId || 'sistema_fallback';
        return this.fluxoCaixaService.fecharCaixa(tenantId, id_unidade, dto, id_usuario);
    }

    @Get('periodo')
    @Permissoes(PERMISSIONS.VISUALIZAR_FINANCEIRO)
    async getFaturamentoPeriodo(
        @TenantId() tenantId: string,
        @Query('data_inicio') dataInicio: string,
        @Query('data_fim') dataFim: string,
        @Query('id_unidade') idUnidade?: string
    ) {
        if (!dataInicio || !dataFim) {
            throw new BadRequestException('As datas de início e fim são obrigatórias.');
        }

        const id_unidade = await this.resolveUnidade(tenantId, idUnidade);
        return this.fluxoCaixaService.getFaturamentoPeriodo(tenantId, id_unidade, new Date(dataInicio), new Date(dataFim));
    }
}
