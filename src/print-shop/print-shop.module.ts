import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { UserModule } from 'src/user/user.module';
import { Tag } from 'src/entity/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintShop, Tag]),
    PrintShopReviewModule,
    UserModule,
  ],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
