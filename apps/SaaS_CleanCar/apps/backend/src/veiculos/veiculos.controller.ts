import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeiculosService } from './veiculos.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('veiculos')
export class VeiculosController {
    constructor(private readonly veiculosService: VeiculosService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_VEICULO)
    create(@TenantId() tenantId: string, @Body() createVeiculoDto: CreateVeiculoDto) {
        return this.veiculosService.create(tenantId, createVeiculoDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_VEICULOS, PERMISSIONS.CRIAR_VEICULO, PERMISSIONS.EDITAR_VEICULO)
    findAll(@TenantId() tenantId: string) {
        return this.veiculosService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.VISUALIZAR_VEICULOS, PERMISSIONS.CRIAR_VEICULO, PERMISSIONS.EDITAR_VEICULO)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.veiculosService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.EDITAR_VEICULO)
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateVeiculoDto: UpdateVeiculoDto) {
        return this.veiculosService.update(tenantId, id, updateVeiculoDto);
    }
}
