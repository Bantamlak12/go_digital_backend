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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { SigninAdminDto } from './dtos/signinUser.dto';
import { AdminDto } from './dtos/admin.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../shared/interceptors/serialize.interceptor';

@ApiTags('auth')
@Controller('auth')
@Serialize(AdminDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  // Create administrator
  @Post('/signup')
  @ApiOperation({ summary: 'An API use to create an account.' })
  @ApiResponse({ status: 201, description: 'Successful registration message.' })
  //   @Session() session: any
  async createAdmin(@Body() body: CreateAdminDto, @Response() res: any) {
    await this.authService.signup(
      body.email,
      body.password,
      body.confirmPassword,
    );

    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'You have successfully registered.',
    });
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  @ApiOperation({
    summary: 'An API use to sign in to the dashboard.',
  })
  @ApiResponse({ status: 200, description: 'Successfull sign in message.' })
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
  @ApiOperation({
    summary: 'An API use to end the current session (sign out).',
  })
  @ApiResponse({ status: 200, description: 'Successfull sign out message.' })
  signoutUser(@Request() req: any, @Response() res: any) {
    // Check if the user is logged in
    if (!req.session || !req.session.userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'fail',
        message: 'You are not signed in',
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
  @ApiOperation({ summary: 'An API use to change a password.' })
  @ApiResponse({
    status: 200,
    description: "Successful 'password Changed' message",
  })
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
  @ApiOperation({
    summary: `This end point is used to request a password reset link.\n
    Frontend Implementation:
    1) Make sure you have a page that handles the route /reset-password/:token. 
    This page should prompt the to enter the new password and confirm it.
    2) Send a POST request to /reset-password/:token with the new password and 
    confirmation.
    `,
  })
  @ApiResponse({
    status: 200,
    description:
      'A success message indicating that the reset link has been sent to your provided email address.',
  })
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
  @ApiOperation({
    summary:
      'This endpoint is used to reset your password if the token sent to your email is still valid.',
  })
  @ApiParam({
    name: 'token',
    description: 'A unique token sent to your email for password reset.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A success message indicating that the password has been successfully reset.',
  })
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
