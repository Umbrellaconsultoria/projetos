import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('clientes')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_CLIENTE)
    create(@TenantId() tenantId: string, @Body() createClienteDto: CreateClienteDto) {
        return this.clientesService.create(tenantId, createClienteDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_CLIENTES, PERMISSIONS.CRIAR_CLIENTE, PERMISSIONS.EDITAR_CLIENTE)
    findAll(@TenantId() tenantId: string) {
        return this.clientesService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.VISUALIZAR_CLIENTES, PERMISSIONS.CRIAR_CLIENTE, PERMISSIONS.EDITAR_CLIENTE)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.clientesService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.EDITAR_CLIENTE)
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
        return this.clientesService.update(tenantId, id, updateClienteDto);
    }
}
