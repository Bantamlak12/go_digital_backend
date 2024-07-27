import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Response,
  Session,
  HttpStatus,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { SigninAdminDto } from './dtos/signinUser.dto';
import { AdminDto } from './dtos/admin.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(AdminDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  // Create administrator
  @Post('/signup')
  //   @Session() session: any
  async createAdmin(@Body() body: CreateAdminDto, @Response() res: any) {
    await this.authService.signup(
      body.email,
      body.password,
      body.confirmPassword,
    );

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully registered.',
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signinUser(
    @Body() body: SigninAdminDto,
    @Request() req: any,
    @Response() res: any,
    @Session() session: any,
  ) {
    session.userId = req.user.id;

    // return req.user;
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully signed in.',
    });
  }

  @Post('/signout')
  signoutUser(@Request() req: any, @Response() res: any) {
    // Check if the user is logged in
    if (!req.session || !req.session.userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'fail',
        message: 'You are not logged in',
      });
    }

    req.session.destroy((err: any) => {
      if (err)
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Failed to destroy session' });
    });
    res.clearCookie('connect.sid');

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully logged out',
    });
  }

  @Post('/change-password')
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

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  }

  // This route will generate a random reset token and sends it to the user
  @Post('/forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Request() req: any,
    @Response() res: any,
  ) {
    await this.authService.forgotPassword(req, body.email);

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Password reset link has been sent to your email.',
    });
  }

  // This route will reset the user password
  @Post('/reset-password/:token')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Param('token') token: string,
    @Response() res: any,
  ) {
    await this.authService.resetPassword(
      token,
      body.newPassword,
      body.confirmPassword,
    );

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully reset your pasword.',
    });
  }
}
