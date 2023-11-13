import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/entity/user.entity';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new ForbiddenException('접근 권한이 없습니다.');
    }

    if (user.userType !== UserType.ADMIN) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }

    return user;
  }
}
