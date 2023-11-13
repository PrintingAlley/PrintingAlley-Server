import { ProductService } from './../product/product.service';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { CreateProductDtoByAdmin } from './dto/create-product.dto';

@UseGuards(AdminAuthGuard)
@Controller('admin')
@ApiTags('Admin')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class AdminController {
  constructor(private readonly productService: ProductService) {}

  @Post('product')
  @ApiOperation({
    summary: '제품 생성',
    description: '제품을 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '제품 생성 성공',
    type: CommonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) product: CreateProductDtoByAdmin,
  ): Promise<CommonResponseDto> {
    const createdProduct = await this.productService.createByAdmin(product);
    return createResponse(200, '성공', createdProduct.id);
  }

  @Put('product/:id')
  @ApiOperation({
    summary: '제품 수정',
    description: '제품을 수정하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 수정 성공',
    type: CommonResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) product: CreateProductDtoByAdmin,
  ): Promise<CommonResponseDto> {
    await this.productService.updateByAdmin(id, product);
    return createResponse(200, '성공', id);
  }
}
