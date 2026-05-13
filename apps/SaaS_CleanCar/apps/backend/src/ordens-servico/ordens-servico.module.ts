import { Module } from '@nestjs/common';
import { OrdensServicoService } from './ordens-servico.service';
import { OrdensServicoController } from './ordens-servico.controller';

@Module({
  providers: [OrdensServicoService],
  controllers: [OrdensServicoController]
})
export class OrdensServicoModule {}
