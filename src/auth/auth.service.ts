import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

  async validateAndRetrieveUser(token: string, provider: string): Promise<any> {
    let userInfo: {
      id: string;
      accessToken: string;
      provider: 'google' | 'apple' | 'kakao' | 'naver';
      email: string;
      name: string;
    };

    switch (provider) {
      case 'google':
        try {
          const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          userInfo = {
            id: googleResponse.data.id,
            accessToken: token,
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
            accessToken: token,
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
            accessToken: token,
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
            accessToken: token,
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

  async verifySocialAccessToken(
    token: string,
    provider: string,
  ): Promise<boolean> {
    switch (provider) {
      case 'google':
        try {
          const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          return googleResponse.status === 200;
        } catch (error) {
          throw new UnauthorizedException('Invalid Google token');
        }

      case 'apple':
        return true;

      case 'kakao':
        try {
          const kakaoResponse = await axios.get(
            `https://kapi.kakao.com/v2/user/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          return kakaoResponse.status === 200;
        } catch (error) {
          throw new UnauthorizedException('Invalid Kakao token');
        }

      case 'naver':
        try {
          const naverResponse = await axios.get(
            `https://openapi.naver.com/v1/nid/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          return naverResponse.status === 200;
        } catch (error) {
          throw new UnauthorizedException('Invalid Naver token');
        }

      default:
        throw new UnauthorizedException('Unsupported authentication provider');
    }
  }

  async unlinkUser(token: string, provider: string): Promise<boolean> {
    switch (provider) {
      case 'google':
        try {
          const response = await axios.post(
            'https://oauth2.googleapis.com/revoke',
            null,
            {
              params: { token },
            },
          );
          if (response.status === 200) {
            return true;
          }
          throw new Error('Failed to unlink Google account');
        } catch (error) {
          throw new Error(`Error unlinking Google account: ${error.message}`);
        }

      case 'apple':
        // Apple doesn't provide a direct API to unlink user accounts.
        // Users must manage their linked apps in their Apple ID account settings.
        return true;

      case 'kakao':
        try {
          const response = await axios.post(
            'https://kapi.kakao.com/v1/user/unlink',
            null,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.status === 200) {
            return true;
          }
          throw new Error('Failed to unlink Kakao account');
        } catch (error) {
          throw new Error(`Error unlinking Kakao account: ${error.message}`);
        }

      case 'naver':
        try {
          const response = await axios.post(
            'https://nid.naver.com/oauth2.0/token',
            null,
            {
              params: {
                grant_type: 'delete',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                access_token: token,
                service_provider: 'NAVER',
              },
            },
          );
          if (response.status === 200) {
            return true;
          }
          throw new Error('Failed to unlink Naver account');
        } catch (error) {
          throw new Error(`Error unlinking Naver account: ${error.message}`);
        }

      default:
        throw new Error('Unsupported authentication provider');
    }
  }

  async logout(token: string): Promise<void> {
    this.tokenBlacklistService.blacklistToken(token);
  }
}
