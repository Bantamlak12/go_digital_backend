import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { AdminService } from 'src/admin/admin.service';

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

Injectable();
export class DeletedUser implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AdminService)) private adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const recoveryToken =
      await this.adminService.findAdminByRecoveryToken(hashedToken);

    if (recoveryToken?.admin?.email && !recoveryToken?.admin?.isActive) {
      return true;
    }

    return false;
  }
}
