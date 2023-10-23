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
  Headers,
  BadRequestException,
  InternalServerErrorException,
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
import { VerifyTokenResponseDto } from './dto/verify-token-response.dto';

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
    const { id, accessToken, provider, name, email } =
      await this.authService.validateAndRetrieveUser(
        data.access_token,
        data.provider,
      );
    const user = await this.userService.findOrCreate(
      id,
      accessToken,
      provider,
      name,
      email,
    );

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
  async logout(
    @Headers('authorization') authHeader: string,
  ): Promise<CommonResponseDto> {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid token');
    }
    await this.authService.logout(token);

    return createResponse(200, '성공', null);
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOperation({
    summary: '소셜 access Token 검증',
    description: '소셜 access Token 검증 API입니다.',
  })
  @ApiOkResponse({
    description: '소셜 access Token 검증 성공',
    type: VerifyTokenResponseDto,
  })
  async verifySocialAccessToken(
    @GetUser() user: User,
  ): Promise<VerifyTokenResponseDto> {
    const accessToken = await this.userService.getSocialAccessToken(user.id);
    const isValid = await this.authService.verifySocialAccessToken(
      accessToken,
      user.provider,
    );
    return { isValid };
  }

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
    console.log('user.accessToken', user.accessToken);
    try {
      // Step 1: 소셜 계정 연동 해제
      const accessToken = await this.userService.getSocialAccessToken(user.id);
      await this.authService.unlinkUser(accessToken, user.provider);

      // Step 2: 사용자 삭제
      await this.userService.deleteUser(user.id);

      return createResponse(200, '성공', null);
    } catch (error) {
      throw new InternalServerErrorException(
        '회원 탈퇴 실패: ' + error.message,
      );
    }
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

    // TODO: accessToken을 어떻게 가져올지 고민해보기
    const accessToken = 'accessToken';

    const user = await this.userService.findOrCreate(
      id,
      accessToken,
      provider,
      name,
      email,
    );
    const jwt = await this.jwtService.signAsync({ userId: user.id });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${jwt}`);
  }
}
