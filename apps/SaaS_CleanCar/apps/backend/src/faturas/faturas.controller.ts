import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, BadRequestException, Req } from '@nestjs/common';
import { FaturasService } from './faturas.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('faturas')
export class FaturasController {
    constructor(private readonly faturasService: FaturasService) { }

    @Get()
    findAll(@Req() req) {
        const id_tenant = req.user.id_tenant;
        return this.faturasService.findAllByTenant(id_tenant);
    }

    @Post(':id/comprovante')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/comprovantes_pix',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `pix-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                return cb(new BadRequestException('Apenas imagens ou PDFs são permitidos!'), false);
            }
            cb(null, true);
        }
    }))
    uploadComprovante(@Req() req, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }
        const url_comprovante = `/uploads/comprovantes_pix/${file.filename}`;
        const id_tenant = req.user.id_tenant;
        return this.faturasService.enviarComprovante(id, id_tenant, url_comprovante);
    }
}
