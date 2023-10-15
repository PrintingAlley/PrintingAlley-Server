import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

@Injectable()
export class AuthService {
  constructor() {}

  async validateAndRetrieveUser(token: string, provider: string): Promise<any> {
    let userInfo: {
      id: string;
      provider: 'google' | 'apple' | 'kakao' | 'naver';
      email: string;
      name: string;
    };

    switch (provider) {
      case 'google':
        try {
          const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
          );
          userInfo = {
            id: googleResponse.data.sub,
            provider,
            email: googleResponse.data.email,
            name: googleResponse.data.name,
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid Google token');
        }
        break;

      case 'apple':
        try {
          const appleKeysResponse = await axios.get(
            'https://appleid.apple.com/auth/keys',
          );
          const keys = appleKeysResponse.data.keys;

          const header = jwt.decode(token, { complete: true }).header;
          const appleKey = keys.find(
            (key: { kid: string }) => key.kid === header.kid,
          );

          jwt.verify(token, jwkToPem(appleKey), {
            algorithms: ['RS256'],
            issuer: 'https://appleid.apple.com',
          });

          const decodedToken = jwt.decode(token) as any;
          userInfo = {
            id: decodedToken.sub,
            provider,
            email: decodedToken.email,
            name: 'Apple User',
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid Apple token');
        }
        break;

      case 'kakao':
        try {
          const kakaoResponse = await axios.get(
            `https://kapi.kakao.com/v2/user/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          userInfo = {
            id: kakaoResponse.data.id.toString(),
            provider,
            email: kakaoResponse.data.kakao_account.email,
            name: kakaoResponse.data.properties.nickname,
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid Kakao token');
        }
        break;

      case 'naver':
        try {
          const naverResponse = await axios.get(
            `https://openapi.naver.com/v1/nid/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          userInfo = {
            id: naverResponse.data.response.id,
            provider,
            email: naverResponse.data.response.email,
            name: naverResponse.data.response.name,
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid Naver token');
        }
        break;

      default:
        throw new UnauthorizedException('Unsupported authentication provider');
    }

    return userInfo;
  }
}
