import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CombosService } from './combos.service';
import { CreateComboDto, UpdateComboDto } from './dto/create-combo.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('combos')
export class CombosController {
    constructor(private readonly combosService: CombosService) { }

    @Post()
    @Permissoes(PERMISSIONS.CRIAR_COMBO)
    create(@TenantId() tenantId: string, @Body() createComboDto: CreateComboDto) {
        return this.combosService.create(tenantId, createComboDto);
    }

    @Get()
    @Permissoes(PERMISSIONS.VISUALIZAR_COMBOS, PERMISSIONS.CRIAR_COMBO, PERMISSIONS.EDITAR_COMBO)
    findAll(@TenantId() tenantId: string) {
        return this.combosService.findAll(tenantId);
    }

    @Get(':id')
    @Permissoes(PERMISSIONS.VISUALIZAR_COMBOS, PERMISSIONS.CRIAR_COMBO, PERMISSIONS.EDITAR_COMBO)
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.combosService.findOne(tenantId, id);
    }

    @Patch(':id')
    @Permissoes(PERMISSIONS.EDITAR_COMBO)
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
        return this.combosService.update(tenantId, id, updateComboDto);
    }
}
