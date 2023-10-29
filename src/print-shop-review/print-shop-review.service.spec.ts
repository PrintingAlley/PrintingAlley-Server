import { Test, TestingModule } from '@nestjs/testing';
import { PrintShopReviewService } from './print-shop-review.service';

describe('PrintShopReviewService', () => {
  let service: PrintShopReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintShopReviewService],
    }).compile();

    service = module.get<PrintShopReviewService>(PrintShopReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
