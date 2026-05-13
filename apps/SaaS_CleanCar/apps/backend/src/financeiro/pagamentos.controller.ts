import { Controller, Get, Post, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { RegistrarPagamentoDto } from './dto/registrar-pagamento.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import { PrismaService } from '../prisma/prisma.service';

@Controller('financeiro/pagamentos')
export class PagamentosController {
    constructor(
        private readonly pagamentosService: PagamentosService,
        private readonly prisma: PrismaService
    ) { }

    @Post()
    @Permissoes(PERMISSIONS.REGISTRAR_PAGAMENTO)
    async registrar(@TenantId() tenantId: string, @Body() dto: RegistrarPagamentoDto) {
        return this.pagamentosService.registrarPagamento(tenantId, dto);
    }

    @Get('os/:id_os')
    @Permissoes(PERMISSIONS.VISUALIZAR_FINANCEIRO)
    async listarPorOS(@TenantId() tenantId: string, @Param('id_os') idOs: string) {
        return this.pagamentosService.listarPorOS(tenantId, idOs);
    }
}
