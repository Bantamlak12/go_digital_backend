import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class Protect implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.session.userId) return true;

    response.redirect('/auth/signin');
    return false;
  }
}
