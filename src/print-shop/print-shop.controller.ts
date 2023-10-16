import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PrintShopService } from './print-shop.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';

@Controller('print-shop')
@ApiTags('Print Shop')
export class PrintShopController {
  constructor(private readonly printShopService: PrintShopService) {}

  @Get()
  @ApiOperation({
    summary: '인쇄소 목록 조회',
    description: '인쇄소 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 목록 조회 성공',
    type: [PrintShop],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호입니다. 1부터 시작하며, 기본값은 1입니다.',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: '페이지 크기입니다. 기본값은 20입니다.',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
  ): Promise<PrintShop[]> {
    return await this.printShopService.findAll(page, size);
  }

  @Post()
  @ApiOperation({
    summary: '인쇄소 생성',
    description: '인쇄소를 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 생성 성공',
    type: PrintShop,
  })
  async create(
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
  ): Promise<PrintShop> {
    return await this.printShopService.create(printShop);
  }

  @Put(':id')
  @ApiOperation({
    summary: '인쇄소 수정',
    description: '인쇄소를 수정하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 수정 성공',
    type: PrintShop,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) printShop: UpdatePrintShopDto,
  ): Promise<PrintShop> {
    return await this.printShopService.update(id, printShop);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '인쇄소 삭제',
    description: '인쇄소를 삭제하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 삭제 성공',
    type: PrintShop,
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<PrintShop> {
    return await this.printShopService.delete(id);
  }
}
