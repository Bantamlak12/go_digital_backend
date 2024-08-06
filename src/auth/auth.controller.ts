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
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { SigninAdminDto } from './dtos/signinUser.dto';
import { AdminDto } from './dtos/admin.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { RestoreAccountDto } from './dtos/restoreAccount.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { Protect, DeletedUser } from './protect.guard';

@ApiTags('auth')
@Controller('auth')
@Serialize(AdminDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  capitalizeString(input: any): string {
    if (!input) return;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  // Create administrator
  @Post('/signup')
  @ApiOperation({ summary: 'This endpoint is used to create an account.' })
  @ApiResponse({ status: 201, description: 'A success registration message.' })
  //   @Session() session: any
  async createAdmin(@Body() body: CreateAdminDto, @Response() res: any) {
    const firstName = this.capitalizeString(body.firstName);
    const lastName = this.capitalizeString(body.lastName);

    await this.authService.signup(
      firstName,
      lastName,
      body.email,
      body.password,
      body.confirmPassword,
    );

    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'You have successfully registered.',
    });
  }

  @Get('/signin')
  @ApiOperation({
    summary: 'This end point is used to get the fronend login page.',
  })
  @ApiResponse({ status: 200 })
  getSignin() {
    return 'Sign in page';
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  @ApiOperation({
    summary: 'This endpoint is used to sign in to the dashboard.',
  })
  @ApiResponse({ status: 200, description: 'A success sign in message.' })
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

  @UseGuards(Protect)
  @Post('/signout')
  @ApiOperation({
    summary: 'This endpoint is used to end the current session (sign out).',
  })
  @ApiResponse({ status: 200, description: 'A success sign out message.' })
  async signoutUser(@Request() req: any, @Response() res: any) {
    // Check if the user is logged in
    if (!req.session || !req.session.userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'fail',
        message: 'You are not signed in',
      });
    }

    await req.session.destroy((err: any) => {
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

  @UseGuards(Protect)
  @Patch('/change-password')
  @ApiOperation({ summary: 'This endpoint is used to change a password.' })
  @ApiResponse({
    status: 200,
    description: 'A success password Changed message',
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
  @UseGuards(Protect)
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
  @UseGuards(Protect)
  @Patch('/reset-password/:token')
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

  @UseGuards(Protect)
  @Delete('/delete-account')
  @ApiOperation({
    summary: `This endpoint is used to delete the account.
    Frontend Implementation:
    1) Make sure you have a page that handles the route /restore-account/:token. 
    This page should prompt the to enter the user's old password. If the user forgot
    the password, there is no way to restore the account.
    2) Send a POST request to /restore-account/:token with the old password
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'A success message indicating that the account is deleted.',
  })
  async deleteAccount(@Request() req: any, @Response() res: any) {
    await this.authService.deleteAccount(req, req.session.userId);
    req.session.destroy();
    res.clearCookie('connect.sid');

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully deleted your account.',
    });
  }

  @UseGuards(DeletedUser)
  @Post('/restore-account/:token')
  @ApiOperation({
    summary: 'This endpoint is used to restore deleted account.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A success message indicating that the deleted account is restorted.',
  })
  async restoreDeletedAccount(
    @Body() body: RestoreAccountDto,
    @Param('token') token: string,
    @Request() req: any,
    @Response() res: any,
    @Session() session: any,
  ) {
    const userId = await this.authService.restoreAccount(token, body.password);
    session.userId = userId;

    // return req.user;
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'You have successfully restorted your account.',
    });
  }
}
