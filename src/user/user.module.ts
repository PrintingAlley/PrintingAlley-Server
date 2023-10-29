import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entity/user.entity';
import { ProductReviewModule } from 'src/product-review/product-review.module';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BookmarkModule,
    PrintShopReviewModule,
    ProductReviewModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
