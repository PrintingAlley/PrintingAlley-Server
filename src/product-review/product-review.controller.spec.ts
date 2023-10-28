import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewController } from './product-review.controller';

describe('ProductReviewController', () => {
  let controller: ProductReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductReviewController],
    }).compile();

    controller = module.get<ProductReviewController>(ProductReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
