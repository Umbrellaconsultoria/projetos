import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Public } from '../common/decorators/public.decorator';
import { Permissoes } from '../common/decorators/permissoes.decorator';
import { PERMISSIONS } from '../common/constants/permissions';

@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Public()
    @Post()
    create(@Body() createTenantDto: CreateTenantDto) {
        return this.tenantsService.create(createTenantDto);
    }

    @Get()
    findAll() {
        return this.tenantsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tenantsService.findOne(id);
    }

    @Post(':id/logo')
    @Permissoes(PERMISSIONS.GERENCIAR_CONFIGURACOES)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `logo-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
            }
            cb(null, true);
        }
    }))
    uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }
        const logoUrl = `/uploads/logos/${file.filename}`;
        return this.tenantsService.updateLogoUrl(id, logoUrl);
    }
}
