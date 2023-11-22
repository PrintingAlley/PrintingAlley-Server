import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PrintShopModule } from './print-shop/print-shop.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { TagModule } from './tag/tag.module';
import { UploadModule } from './upload/upload.module';
import { ProductModule } from './product/product.module';
import { ProductReviewModule } from './product-review/product-review.module';
import { PrintShopReviewModule } from './print-shop-review/print-shop-review.module';
import { CategoryModule } from './category/category.module';
import { VersionModule } from './version/version.module';
import { ContentModule } from './content/content.module';
import { AdminModule } from './admin/admin.module';
import ConfigModule from './config';

@Module({
  imports: [
    ConfigModule(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
      ssl:
        process.env.NODE_ENV === 'local'
          ? false
          : { rejectUnauthorized: false },
    }),
    UserModule,
    ProductModule,
    PrintShopModule,
    BookmarkModule,
    TagModule,
    CategoryModule,
    ContentModule,
    AuthModule,
    UploadModule,
    ProductReviewModule,
    PrintShopReviewModule,
    VersionModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
