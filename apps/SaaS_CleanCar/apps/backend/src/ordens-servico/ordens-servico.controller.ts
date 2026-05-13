import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OrdensServicoService } from './ordens-servico.service';
import { CreateOrdemServicoDto } from './dto/create-ordem-servico.dto';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { UpdateStatusOsDto } from './dto/update-status-os.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('ordens-servico')
export class OrdensServicoController {
    constructor(private readonly ordensServicoService: OrdensServicoService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_ORDEM_SERVICO)
    create(@TenantId() tenantId: string, @Body() createOrdemServicoDto: CreateOrdemServicoDto) {
        return this.ordensServicoService.create(tenantId, createOrdemServicoDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_ORDEM_SERVICO, PERMISSIONS.CRIAR_ORDEM_SERVICO, PERMISSIONS.EDITAR_ORDEM_SERVICO)
    findAll(@TenantId() tenantId: string) {
        return this.ordensServicoService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.VISUALIZAR_ORDEM_SERVICO, PERMISSIONS.CRIAR_ORDEM_SERVICO, PERMISSIONS.EDITAR_ORDEM_SERVICO)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.ordensServicoService.findOne(tenantId, id);
    }

    @Patch(':id/status')
    @Permissoes(PERMISSIONS.EDITAR_ORDEM_SERVICO)
    updateStatus(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() dto: UpdateStatusOsDto
    ) {
        return this.ordensServicoService.updateStatus(tenantId, id, dto.status);
    }

    @Get(':id/pdf')
    @Permissoes(PERMISSIONS.VISUALIZAR_ORDEM_SERVICO, PERMISSIONS.CRIAR_ORDEM_SERVICO, PERMISSIONS.EDITAR_ORDEM_SERVICO)
    async downloadPdf(@TenantId() tenantId: string, @Param('id') id: string, @Res() res: Response) {
        const buffer = await this.ordensServicoService.generatePdf(tenantId, id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=os-${id}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

    // Add other endpoints like update status, add payment, etc later.
    // For now MVP CRUD.
}
