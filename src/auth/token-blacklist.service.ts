import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
