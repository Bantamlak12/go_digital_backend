import {
  Controller,
  Body,
  //   Get,
  Post,
  //   Patch,
  //   Delete,
  //   Session,
} from '@nestjs/common';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { SigninAdminDto } from './dtos/signinUser.dto';
import { AdminDto } from './dtos/admin.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Create administrator
  @Serialize(AdminDto)
  @Post('/signup')
  //   @Session() session: any
  async createAdmin(@Body() body: CreateAdminDto) {
    const admin = this.authService.signup(
      body.email,
      body.password,
      body.confirmPassword,
    );

    return admin;
  }

  @Post('/signin')
  @Serialize(AdminDto)
  async signinUser(@Body() body: SigninAdminDto) {
    const admin = await this.authService.signin(body.email, body.password);

    return admin;
  }
}
