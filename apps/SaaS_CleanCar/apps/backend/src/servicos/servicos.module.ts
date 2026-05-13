import { Module } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { ServicosController } from './servicos.controller';

@Module({
  providers: [ServicosService],
  controllers: [ServicosController]
})
export class ServicosModule {}
