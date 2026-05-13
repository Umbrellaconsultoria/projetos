import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('servicos')
export class ServicosController {
    constructor(private readonly servicosService: ServicosService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_SERVICO)
    create(@TenantId() tenantId: string, @Body() createServicoDto: CreateServicoDto) {
        return this.servicosService.create(tenantId, createServicoDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_SERVICOS, PERMISSIONS.CRIAR_SERVICO, PERMISSIONS.EDITAR_SERVICO)
    findAll(@TenantId() tenantId: string) {
        return this.servicosService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.VISUALIZAR_SERVICOS, PERMISSIONS.CRIAR_SERVICO, PERMISSIONS.EDITAR_SERVICO)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.servicosService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.EDITAR_SERVICO)
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
        return this.servicosService.update(tenantId, id, updateServicoDto);
    }
}
