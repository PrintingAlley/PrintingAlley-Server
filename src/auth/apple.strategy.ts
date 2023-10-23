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
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
      passReqToCallback: true,
      scope: ['name', 'email'],
    });
  }

  async validate(req, accessToken, refreshToken, profile, done) {
    done(null, { ...profile, accessToken });
  }
}
