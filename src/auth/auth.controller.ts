import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  ValidationPipe,
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
import { User } from 'src/entity/user.entity';
import {
  ThirdPartyLoginDto,
  ThirdPartyLoginResponseDto,
} from './dto/third-party-login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private async handleAuthRedirect(req, res) {
    const { id, provider, displayName, emails } = req.user;

    const email = emails && emails[0]?.value ? emails[0].value : '이메일없음';
    const name = displayName || '이름없음';

    const user = await this.userService.findOrCreate(id, provider, name, email);
    const jwt = await this.jwtService.signAsync({ userId: user.id });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${jwt}`);
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

  @Post('login')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '소셜 로그인 OAuth를 이용한 인증 API입니다.',
  })
  @ApiOkResponse({
    description: 'JWT 토큰을 반환합니다.',
    type: ThirdPartyLoginResponseDto,
  })
  async thirdPartyLogin(@Body(new ValidationPipe()) data: ThirdPartyLoginDto) {
    const { id, provider, name, email } =
      await this.authService.validateAndRetrieveUser(
        data.access_token,
        data.provider,
      );
    const user = await this.userService.findOrCreate(id, provider, name, email);

    const payload = { userId: user.id };
    const jwt = await this.jwtService.signAsync(payload);
    return { access_token: jwt };
  }

  @Get('jwt-test')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'JWT 테스트',
    description: 'JWT 인증 테스트 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '유저 정보를 반환합니다.',
    type: User,
  })
  jwtAuth(@Req() req) {
    return req.user;
  }
}
