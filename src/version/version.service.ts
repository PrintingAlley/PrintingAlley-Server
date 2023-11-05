import { Injectable } from '@nestjs/common';
import { API_VERSION } from 'src/config/constants';

@Injectable()
export class VersionService {
  checkVersion(version: string): number {
    if (version !== API_VERSION) {
      return 2;
    } else {
      return 0;
    }
  }
}
