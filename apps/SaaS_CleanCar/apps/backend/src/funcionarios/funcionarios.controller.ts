import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from './dto/create-funcionario.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('funcionarios')
export class FuncionariosController {
    constructor(private readonly funcionariosService: FuncionariosService) { }

    @Post()
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    create(@TenantId() tenantId: string, @Body() dto: CreateFuncionarioDto) {
        console.log('--- CREATING FUNCIONARIO ---');
        console.log('TenantID:', tenantId);
        console.log('DTO:', dto);
        return this.funcionariosService.create(tenantId, dto);
    }

    @Get()
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    findAll(@TenantId() tenantId: string) {
        return this.funcionariosService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.funcionariosService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: UpdateFuncionarioDto) {
        return this.funcionariosService.update(tenantId, id, dto);
    }

    @Delete(':id')
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.funcionariosService.remove(tenantId, id);
    }

    @Get('relatorios/produtividade')
    @Permissoes(PERMISSIONS.GERENCIAR_FUNCIONARIOS)
    getProductivity(
        @TenantId() tenantId: string,
        @Query('data') data?: string
    ) {
        const date = data ? new Date(data) : new Date();
        return this.funcionariosService.getProductivity(tenantId, date);
    }
}
