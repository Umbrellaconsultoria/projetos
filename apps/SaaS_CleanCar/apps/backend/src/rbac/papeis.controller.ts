import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreatePapelDto, UpdatePapelDto } from './dto/create-papel.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('rbac') // Grouping under /rbac
export class RbacController {
    constructor(private readonly rbacService: RbacService) { }

    @Get('permissoes')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    listPermissions() {
        return this.rbacService.listPermissions();
    }

    @Post('papeis')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    createPapel(@TenantId() tenantId: string, @Body() dto: CreatePapelDto) {
        return this.rbacService.createPapel(tenantId, dto);
    }

    @Get('papeis')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    findAllPapeis(@TenantId() tenantId: string) {
        return this.rbacService.findAllPapeis(tenantId);
    }

    @Get('papeis/:id')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    findOnePapel(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.rbacService.findOnePapel(tenantId, id);
    }

    @Patch('papeis/:id')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    updatePapel(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: UpdatePapelDto) {
        return this.rbacService.updatePapel(tenantId, id, dto);
    }

    @Delete('papeis/:id')
    @Permissoes(PERMISSIONS.GERENCIAR_PAPEIS)
    deletePapel(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.rbacService.deletePapel(tenantId, id);
    }
}
