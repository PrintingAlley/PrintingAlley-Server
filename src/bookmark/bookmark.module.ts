import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'src/entity/bookmark.entity';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import { PrintShop } from 'src/entity/print-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, BookmarkGroup, PrintShop])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
