import { Module } from '@nestjs/common';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { FluxoCaixaController } from './fluxo-caixa.controller';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';

import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [FluxoCaixaService, PagamentosService],
  controllers: [FluxoCaixaController, PagamentosController]
})
export class FinanceiroModule { }
