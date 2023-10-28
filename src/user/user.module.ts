import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entity/user.entity';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { ProductReviewModule } from 'src/product-review/product-review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BookmarkGroup, Bookmark]),
    ProductReviewModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
