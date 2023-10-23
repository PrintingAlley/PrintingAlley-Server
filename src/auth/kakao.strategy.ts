import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: `${process.env.API_URL}/auth/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ) {
    done(null, { ...profile, accessToken, refreshToken });
  }
}
