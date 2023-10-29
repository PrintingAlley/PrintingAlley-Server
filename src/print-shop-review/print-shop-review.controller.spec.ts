import { Test, TestingModule } from '@nestjs/testing';
import { PrintShopReviewController } from './print-shop-review.controller';

describe('PrintShopReviewController', () => {
  let controller: PrintShopReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintShopReviewController],
    }).compile();

    controller = module.get<PrintShopReviewController>(PrintShopReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
