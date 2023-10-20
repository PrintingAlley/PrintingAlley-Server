import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorators/user.decorator';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UserResponseDto } from './dto/user-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
@ApiTags('User')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 내 정보 조회
  @Get()
  @ApiOperation({
    summary: '내 정보 조회',
    description: '로그인한 사용자의 정보를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내 정보 조회 성공',
    type: UserResponseDto,
  })
  async getMyInfo(@GetUser() user: User): Promise<User> {
    return this.userService.getUserById(user.id);
  }

  // 이름 수정
  @Put('name')
  @ApiOperation({
    summary: '이름 수정',
    description: '로그인한 사용자의 이름을 수정하는 API입니다.',
  })
  @ApiOkResponse({
    description: '이름 수정 성공',
    type: CommonResponseDto,
  })
  async updateName(
    @Body(new ValidationPipe()) updateNameDto: UpdateUserNameDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.userService.updateName(user.id, updateNameDto.name);
    return createResponse(200, '성공', null);
  }
}
