import { Injectable } from '@nestjs/common';
import { API_CURRENT_VERSION, API_MINIMUM_VERSION } from 'src/config/constants';

@Injectable()
export class VersionService {
  checkVersion(version: string): number {
    if (version >= API_CURRENT_VERSION) {
      return 0;
    }
    if (version >= API_MINIMUM_VERSION) {
      return 1;
    }
    return 2;
  }
}
