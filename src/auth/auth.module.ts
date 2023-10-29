import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { NaverStrategy } from './naver.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';
import { ProductReviewModule } from 'src/product-review/product-review.module';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
// TODO:: Add Apple Auth Setting
// import { AppleStrategy } from './apple.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
    BookmarkModule,
    PrintShopReviewModule,
    ProductReviewModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TokenBlacklistService,
    JwtStrategy,
    GoogleStrategy,
    NaverStrategy,
    KakaoStrategy,
    // TODO:: Add Apple Auth Setting
    // AppleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
