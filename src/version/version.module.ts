import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';

@Module({
  providers: [VersionService],
  controllers: [VersionController],
  exports: [VersionService],
})
export class VersionModule {}
