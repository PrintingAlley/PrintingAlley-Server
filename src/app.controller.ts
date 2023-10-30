import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description:
      'This is the index page. You can view the API document at {swagger url} and node env is {node env}.',
  })
  getIndex(): string {
    return this.appService.getIndex();
  }

  @Get('api-url')
  @ApiOkResponse({
    description: 'API URL',
  })
  getApiUrl(): string {
    return this.appService.getApiUrl();
  }

  @Get('api-version')
  @ApiOkResponse({
    description: 'API Version',
  })
  getApiVersion(): string {
    return this.appService.getApiVersion();
  }
}
