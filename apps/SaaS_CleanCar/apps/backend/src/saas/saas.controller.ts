import { Controller, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { SaasService } from './saas.service';
import { SaasProviderGuard } from '../common/guards/saas-provider.guard';

@UseGuards(SaasProviderGuard)
@Controller('saas')
export class SaasController {
    constructor(private readonly saasService: SaasService) { }

    @Get('tenants')
    getTenants() {
        return this.saasService.listarTenants();
    }

    @Get('faturas')
    getFaturas() {
        return this.saasService.listarFaturas();
    }

    @Post('faturas/:id/aprovar')
    aprovarFatura(@Param('id') id: string) {
        return this.saasService.aprovarFatura(id);
    }

    @Post('faturas/:id/rejeitar')
    rejeitarFatura(@Param('id') id: string) {
        return this.saasService.rejeitarFatura(id);
    }

    @Post('assinaturas/:id/status')
    mudarStatusAssinatura(@Param('id') id: string, @Body('status') status: any) {
        return this.saasService.mudarStatusAssinatura(id, status);
    }

    @Post('faturas/:id/status')
    mudarStatusFatura(@Param('id') id: string, @Body('status') status: any) {
        return this.saasService.mudarStatusFatura(id, status);
    }
}
