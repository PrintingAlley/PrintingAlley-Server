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
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { CreateBookmarkGroupDto } from './dto/create-bookmark-group.dto';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entity/user.entity';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { DeleteMultipleGroupsDto } from './dto/delete-multiple-groups.dto';
import { DeleteMultipleBookmarksDto } from './dto/delete-multiple-bookmarks.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmark')
@ApiTags('Bookmark')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('my-bookmarks')
  @ApiOperation({
    summary: '내 북마크 조회',
    description: '내 북마크를 조회하는 API입니다.',
  })
  @ApiOkResponse({ description: '내 북마크 조회 성공', type: [BookmarkGroup] })
  async getMyBookmarks(@GetUser() user: User): Promise<BookmarkGroup[]> {
    return this.bookmarkService.getBookmarksByUser(user.id);
  }

  @Post('group')
  @ApiOperation({
    summary: '북마크 그룹 생성',
    description: '북마크 그룹을 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 그룹 생성 성공',
    type: CommonResponseDto,
  })
  async createBookmarkGroup(
    @Body() createBookmarkGroupDto: CreateBookmarkGroupDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const createdGroup = await this.bookmarkService.createBookmarkGroup(
      createBookmarkGroupDto,
      user.id,
    );
    return createResponse(200, '성공', createdGroup.id);
  }

  @Put('group/:bookmarkId/:groupId')
  @ApiOperation({
    summary: '북마크에 그룹 연결',
    description: '북마크에 그룹을 연결하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크에 그룹 연결 성공',
    type: CommonResponseDto,
  })
  async connectGroupToBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('groupId') groupId: number,
  ): Promise<CommonResponseDto> {
    await this.bookmarkService.connectGroupToBookmark(bookmarkId, groupId);
    return createResponse(200, '성공', bookmarkId);
  }

  @Delete('group/:id')
  @ApiOperation({
    summary: '북마크 그룹 삭제',
    description: '북마크 그룹을 삭제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 그룹 삭제 성공',
    type: CommonResponseDto,
  })
  async deleteBookmarkGroup(
    @Param('id') id: number,
  ): Promise<CommonResponseDto> {
    await this.bookmarkService.deleteBookmarkGroup(id);
    return createResponse(200, '성공', id);
  }

  @Delete('groups')
  @ApiOperation({
    summary: '여러 북마크 그룹 삭제',
    description: '여러 북마크 그룹을 삭제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 그룹들 삭제 성공',
    type: CommonResponseDto,
  })
  async deleteMultipleBookmarkGroups(
    @Body() deleteGroupsDto: DeleteMultipleGroupsDto,
  ): Promise<CommonResponseDto> {
    await this.bookmarkService.deleteMultipleBookmarkGroups(
      deleteGroupsDto.groupIds,
    );
    return createResponse(200, '성공', deleteGroupsDto.groupIds);
  }

  @Post()
  @ApiOperation({
    summary: '북마크 추가',
    description:
      '북마크를 추가하는 API입니다. bookmarkGroupId은 옵션입니다. 생략하면 기본 그룹에 추가됩니다.',
  })
  @ApiOkResponse({ description: '북마크 추가 성공', type: CommonResponseDto })
  async addBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const addedBookmark = await this.bookmarkService.addBookmark(
      createBookmarkDto,
      user.id,
    );
    return createResponse(200, '성공', addedBookmark.id);
  }

  @Delete('batch')
  @ApiOperation({
    summary: '여러 북마크 해제',
    description: '여러 북마크를 해제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크들 해제 성공',
    type: CommonResponseDto,
  })
  async deleteMultipleBookmarks(
    @Body() deleteBookmarksDto: DeleteMultipleBookmarksDto,
  ): Promise<CommonResponseDto> {
    await this.bookmarkService.deleteMultipleBookmarks(
      deleteBookmarksDto.bookmarkIds,
    );
    return createResponse(200, '성공', deleteBookmarksDto.bookmarkIds);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '북마크 해제',
    description: '북마크를 해제하는 API입니다.',
  })
  @ApiOkResponse({ description: '북마크 해제 성공', type: CommonResponseDto })
  async deleteBookmark(@Param('id') id: number): Promise<CommonResponseDto> {
    await this.bookmarkService.deleteBookmark(id);
    return createResponse(200, '성공', id);
  }
}
