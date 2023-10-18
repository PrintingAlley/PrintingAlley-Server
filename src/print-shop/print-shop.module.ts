import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Tag } from 'src/entity/tag.entity';
import { Bookmark } from 'src/entity/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintShop, Tag, Bookmark])],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
