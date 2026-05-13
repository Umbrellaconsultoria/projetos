import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.usuariosService.findAll(tenantId);
    }

    @Post()
    create(@TenantId() tenantId: string, @Body() dto: CreateUsuarioDto) {
        return this.usuariosService.create(tenantId, dto);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.usuariosService.findById(tenantId, id);
    }

    @Patch(':id')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() data: any) {
        return this.usuariosService.update(tenantId, id, data);
    }
}
