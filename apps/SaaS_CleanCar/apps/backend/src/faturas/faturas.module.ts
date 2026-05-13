import { Module } from '@nestjs/common';
import { FaturasService } from './faturas.service';
import { FaturasController } from './faturas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FaturasController],
    providers: [FaturasService],
    exports: [FaturasService],
})
export class FaturasModule { }
