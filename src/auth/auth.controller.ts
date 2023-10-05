import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private async handleOAuthCallback(req, res) {
    const { id, provider, displayName, emails } = req.user;

    const email = emails && emails[0]?.value ? emails[0].value : '이메일없음';
    const name = displayName || '이름없음';

    const user = await this.userService.findOrCreate(id, provider, name, email);
    const jwt = await this.jwtService.signAsync({ userId: user.id });
    res.json({ token: jwt });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 OAuth를 이용한 인증',
  })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인 콜백',
    description: '구글 인증 후의 콜백 처리',
  })
  googleAuthCallback(@Req() req, @Res() res) {
    return this.handleOAuthCallback(req, res);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({
    summary: '네이버 로그인',
    description: '네이버 OAuth를 이용한 인증',
  })
  naverAuth() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({
    summary: '네이버 로그인 콜백',
    description: '네이버 인증 후의 콜백 처리',
  })
  naverAuthCallback(@Req() req, @Res() res) {
    return this.handleOAuthCallback(req, res);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 OAuth를 이용한 인증',
  })
  kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 인증 후의 콜백 처리',
  })
  kakaoAuthCallback(@Req() req, @Res() res) {
    return this.handleOAuthCallback(req, res);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({
    summary: '애플 로그인',
    description: '애플 OAuth를 이용한 인증',
  })
  appleAuth() {}

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({
    summary: '애플 로그인 콜백',
    description: '애플 인증 후의 콜백 처리',
  })
  appleAuthCallback(@Req() req, @Res() res) {
    return this.handleOAuthCallback(req, res);
  }

  @Get('jwt-test')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'JWT 테스트',
    description: 'JWT 인증 테스트 엔드포인트',
  })
  jwtAuth(@Req() req) {
    return req.user;
  }
}
