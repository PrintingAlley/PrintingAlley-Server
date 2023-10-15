import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/naver/callback`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ) {
    done(null, profile);
  }
}
