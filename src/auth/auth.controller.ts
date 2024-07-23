import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Response,
  HttpCode,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { SigninAdminDto } from './dtos/signinUser.dto';
import { AdminDto } from './dtos/admin.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(AdminDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  // Create administrator
  @Post('/signup')
  //   @Session() session: any
  async createAdmin(@Body() body: CreateAdminDto) {
    const admin = await this.authService.signup(
      body.email,
      body.password,
      body.confirmPassword,
    );

    return admin;
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  @HttpCode(200)
  async signinUser(
    @Body() body: SigninAdminDto,
    @Request() req: any,
    @Session() session: any,
  ) {
    session.userId = req.user.id;
    return req.user;
  }

  @Post('/signout')
  signoutUser(@Request() req: any, @Response() res: any) {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ message: 'Failed to destroy session' });
    });
    res.clearCookie('connect.sid');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }

  @Post('/update-password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Request() req: any,
    @Response() res: any,
  ) {
    const userId = req.session.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    await this.authService.updateAdminPassword(
      userId,
      body.currentPassword,
      body.newPassword,
      body.confirmPassword,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  }
}
