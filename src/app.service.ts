import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex(): string {
    return `This is the index page. You can view the API document at ${this.getApiUrl()}/api and node env is ${
      process.env.NODE_ENV
    }.`;
  }

  getApiUrl(): string {
    return process.env.API_URL;
  }
}
