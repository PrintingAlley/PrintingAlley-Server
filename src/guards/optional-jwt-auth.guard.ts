import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (e) {
      return true;
    }
  }

  handleRequest(err, user, info) {
    return user || null;
  }
}
