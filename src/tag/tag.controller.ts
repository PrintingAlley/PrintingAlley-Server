import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Tag } from 'src/entity/tag.entity';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({
    summary: '태그 생성',
    description:
      '태그를 생성하는 API입니다. 부모 태그 ID와 태그 이미지는 옵션입니다. 부모 태그가 없다면, 해당 태그는 최상위 태그가 됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '태그가 성공적으로 생성되었습니다.',
  })
  @ApiBody({ description: '태그 이름 및 부모 태그 ID', type: CreateTagDto })
  async createTag(
    @Body(new ValidationPipe()) createTagDto: CreateTagDto,
  ): Promise<Tag> {
    return this.tagService.createTag(createTagDto);
  }

  @Get(':id/hierarchy')
  @ApiOperation({
    summary: '태그 계층 구조 조회',
    description: '태그 계층 구조를 조회하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그 계층 구조를 성공적으로 가져왔습니다.',
  })
  async getTagHierarchy(@Param('id') id: number): Promise<Tag> {
    return this.tagService.getTagHierarchy(id);
  }

  @Get('/top-level')
  @ApiOperation({
    summary: '최상위 태그 가져오기',
    description: '최상위 태그를 가져오는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '최상위 태그를 성공적으로 가져왔습니다.',
    type: [Tag],
  })
  async getTopLevelTags(): Promise<Tag[]> {
    return this.tagService.getTopLevelTags();
  }

  @Delete(':id')
  @ApiOperation({
    summary: '태그 삭제',
    description: '태그를 삭제하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그가 성공적으로 삭제되었습니다.',
  })
  async deleteTag(@Param('id') id: number): Promise<void> {
    return this.tagService.deleteTag(id);
  }
}
