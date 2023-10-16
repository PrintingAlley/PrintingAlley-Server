import { Test, TestingModule } from '@nestjs/testing';
import { PrintShopController } from './print-shop.controller';

describe('PrintShopController', () => {
  let controller: PrintShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintShopController],
    }).compile();

    controller = module.get<PrintShopController>(PrintShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
