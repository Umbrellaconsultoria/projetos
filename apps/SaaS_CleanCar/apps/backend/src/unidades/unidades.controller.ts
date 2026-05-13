import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto, UpdateUnidadeDto } from './dto/create-unidade.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('unidades')
export class UnidadesController {
    constructor(private readonly unidadesService: UnidadesService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_UNIDADE) // Need to verify if this permission constant exists
    create(@TenantId() tenantId: string, @Body() createUnidadeDto: CreateUnidadeDto) {
        return this.unidadesService.create(tenantId, createUnidadeDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_UNIDADES)
    findAll(@TenantId() tenantId: string) {
        return this.unidadesService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.unidadesService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.EDITAR_UNIDADE) // Need to verify
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadeDto) {
        return this.unidadesService.update(tenantId, id, updateUnidadeDto);
    }
}
