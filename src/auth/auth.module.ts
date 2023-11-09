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
import { AppleStrategy } from './apple.strategy';
import { NaverStrategy } from './naver.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';
import { ProductReviewModule } from 'src/product-review/product-review.module';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { VersionModule } from 'src/version/version.module';
import { UserCounter } from 'src/entity/user-counter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserCounter]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
    VersionModule,
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
    AppleStrategy,
    NaverStrategy,
    KakaoStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
