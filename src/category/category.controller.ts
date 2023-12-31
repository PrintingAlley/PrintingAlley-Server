import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from 'src/entity/category.entity';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesResponseDto } from './dto/category-response.dto';
import { CategoryListSwaggerDto } from './dto/swagger/category-response.swagger.dto';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '카테고리 목록을 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '카테고리 목록 조회 성공',
    type: CategoryListSwaggerDto,
  })
  async getCategories(): Promise<CategoriesResponseDto> {
    const categories = await this.categoryService.getCategories();
    return { categories };
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: '카테고리 생성',
    description: '카테고리를 생성하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '카테고리 생성 성공',
    type: Category,
  })
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<CommonResponseDto> {
    const category = await this.categoryService.createCategory(categoryData);
    return createResponse(200, '카테고리 생성 성공', category.id);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: '카테고리 수정',
    description: '카테고리를 수정하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '카테고리 수정 성공',
    type: Category,
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryData: CreateCategoryDto,
  ): Promise<CommonResponseDto> {
    await this.categoryService.updateCategory(id, categoryData);
    return createResponse(200, '카테고리 수정 성공', id);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '카테고리를 삭제하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '카테고리 삭제 성공',
    type: Category,
  })
  async deleteCategory(@Param('id') id: number): Promise<CommonResponseDto> {
    await this.categoryService.deleteCategory(id);
    return createResponse(200, '카테고리 삭제 성공', id);
  }
}
