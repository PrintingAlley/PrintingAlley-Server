import { Test, TestingModule } from '@nestjs/testing';
import { PrintShopService } from './print-shop.service';

describe('PrintShopService', () => {
  let service: PrintShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintShopService],
    }).compile();

    service = module.get<PrintShopService>(PrintShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
