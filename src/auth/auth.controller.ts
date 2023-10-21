import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { SocialLoginResponseDto } from './dto/social-login-response.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '소셜 로그인 OAuth를 이용한 인증 API입니다.',
  })
  @ApiOkResponse({
    description: 'JWT 토큰을 반환합니다.',
    type: SocialLoginResponseDto,
  })
  async socialLogin(
    @Body(new ValidationPipe()) data: SocialLoginDto,
  ): Promise<SocialLoginResponseDto> {
    const { id, provider, name, email } =
      await this.authService.validateAndRetrieveUser(
        data.access_token,
        data.provider,
      );
    const user = await this.userService.findOrCreate(id, provider, name, email);

    const payload = { userId: user.id };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      message: '성공',
      access_token: jwt,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃 API입니다.',
  })
  @ApiOkResponse({
    description: '로그아웃 성공',
    type: CommonResponseDto,
  })
  async logout(@GetUser() user: User): Promise<CommonResponseDto> {
    console.log(user);
    // TODO: 로그아웃 처리
    return createResponse(200, '성공', null);
  }

  // 회원 탈퇴
  @Delete('withdrawal')
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴 API입니다.',
  })
  @ApiOkResponse({
    description: '회원 탈퇴 성공',
    type: CommonResponseDto,
  })
  async deleteUser(@GetUser() user: User): Promise<CommonResponseDto> {
    console.log(user);
    // TODO: 회원 탈퇴 처리
    return createResponse(200, '성공', null);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 OAuth를 이용한 인증 API입니다.',
  })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인 콜백',
    description: '구글 인증 후의 콜백 처리 API입니다.',
  })
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.handleAuthRedirect(req, res);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({
    summary: '네이버 로그인',
    description: '네이버 OAuth를 이용한 인증 API입니다.',
  })
  naverAuth() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({
    summary: '네이버 로그인 콜백',
    description: '네이버 인증 후의 콜백 처리 API입니다.',
  })
  naverAuthRedirect(@Req() req, @Res() res) {
    return this.handleAuthRedirect(req, res);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 OAuth를 이용한 인증 API입니다.',
  })
  kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 인증 후의 콜백 처리 API입니다.',
  })
  kakaoAuthRedirect(@Req() req, @Res() res) {
    return this.handleAuthRedirect(req, res);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({
    summary: '애플 로그인',
    description: '애플 OAuth를 이용한 인증 API입니다.',
  })
  appleAuth() {}

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({
    summary: '애플 로그인 콜백',
    description: '애플 인증 후의 콜백 처리 API입니다.',
  })
  appleAuthRedirect(@Req() req, @Res() res) {
    return this.handleAuthRedirect(req, res);
  }

  private async handleAuthRedirect(req, res) {
    const { id, provider, displayName, emails } = req.user;

    const email = emails && emails[0]?.value ? emails[0].value : '이메일없음';
    const name = displayName || '이름없음';

    const user = await this.userService.findOrCreate(id, provider, name, email);
    const jwt = await this.jwtService.signAsync({ userId: user.id });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${jwt}`);
  }
}
