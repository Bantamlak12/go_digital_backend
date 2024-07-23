import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, passport: string): Promise<any> {
    const admin = await this.authService.validateUser(email, passport);
    if (!admin) {
      throw new UnauthorizedException();
    }

    return admin;
  }
}
