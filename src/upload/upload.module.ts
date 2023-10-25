import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudflareService } from './cloudflare.service';

@Module({
  controllers: [UploadController],
  providers: [CloudflareService],
})
export class UploadModule {}
