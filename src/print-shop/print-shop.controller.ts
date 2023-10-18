import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PrintShopService } from './print-shop.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
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

  @Get(':id')
  @ApiOperation({
    summary: '인쇄소 조회',
    description: '인쇄소를 조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 조회 성공',
    type: PrintShop,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PrintShop> {
    return await this.printShopService.findOne(id);
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

  @Get('/by-tags')
  @ApiOperation({
    summary: '태그로 인쇄소 검색',
    description: '태그로 인쇄소를 검색하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그와 연관된 인쇄소를 성공적으로 가져왔습니다.',
  })
  @ApiQuery({
    name: 'tagIds',
    type: [Number],
    required: true,
    description: '태그 ID 목록',
  })
  async getPrintShopsByTags(
    @Query('tagIds', ParseArrayPipe) tagIds: number[],
  ): Promise<PrintShop[]> {
    return this.printShopService.getPrintShopsByTags(tagIds);
  }

  @Post(':id/add-tags')
  @ApiOperation({
    summary: '인쇄소에 태그 추가',
    description: '인쇄소에 태그를 추가하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그가 성공적으로 추가되었습니다.',
  })
  @ApiBody({ description: '태그 ID 목록', type: [Number] })
  async addTagsToPrintShop(
    @Param('id') id: number,
    @Body('tagIds') tagIds: number[],
  ): Promise<PrintShop> {
    return this.printShopService.addTagsToPrintShop(id, tagIds);
  }

  @Post(':id/remove-tags')
  @ApiOperation({
    summary: '인쇄소에서 태그 연결 해제',
    description: '인쇄소에서 태그를 연결 해제하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그가 성공적으로 연결 해제되었습니다.',
  })
  @ApiBody({ description: '태그 ID 목록', type: [Number] })
  async removeTagsFromPrintShop(
    @Param('id') id: number,
    @Body('tagIds') tagIds: number[],
  ): Promise<PrintShop> {
    return this.printShopService.removeTagsFromPrintShop(id, tagIds);
  }
}
