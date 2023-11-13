import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
