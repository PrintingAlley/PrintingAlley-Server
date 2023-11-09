import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      callbackURL: `${process.env.API_URL}/auth/apple/callback`,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      passReqToCallback: true,
      scope: ['name', 'email'],
    });
  }

  async validate(
    req: any,
    accessToken: string,
    results: {
      id_token: string;
      refresh_token: string;
      expires_in: number;
      access_token: string;
      token_type: string;
    },
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    done(null, { ...profile, accessToken });
  }
}
