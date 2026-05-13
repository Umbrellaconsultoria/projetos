import { Test, TestingModule } from '@nestjs/testing';
import { VeiculosController } from './veiculos.controller';

describe('VeiculosController', () => {
  let controller: VeiculosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeiculosController],
    }).compile();

    controller = module.get<VeiculosController>(VeiculosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
