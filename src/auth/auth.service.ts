import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  forwardRef,
  NotFoundException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { CustomeMailerService } from 'src/shared/mailer/mailer.service';
import { generatePasswordResetEmail } from 'src/shared/mailer/templates/mailerTemplate';
import { promisify } from 'util';

// Change the _scrypt function to promise-based to use await
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    private mailerService: CustomeMailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const [admin] = await this.adminService.find(email);

    if (!admin) {
      throw new BadRequestException('User or password is not correct');
    }

    const [salt, storedHash] = admin.password.split('.');
    const newHash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== newHash.toString('hex')) {
      throw new BadRequestException('User or password is not correct');
    }

    return admin;
  }

  async hashPassword(
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match.');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

    return hashedPassword;
  }

  async signup(email: string, password: string, confirmPassword: string) {
    // Check if the email is already registered
    const admins = await this.adminService.find(email);

    // If the user is registered, return an error message
    if (admins.length) {
      throw new ConflictException('Email is in use.');
    }

    // Check if the password and confirmPassword do match
    const hashedPassword = await this.hashPassword(password, confirmPassword);

    // Create the user and save to database
    const admin = await this.adminService.create(email, hashedPassword);

    // Return the admin
    return admin;
  }

  async updateAdminPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    // Check if the user exist in the database
    const admin = await this.adminService.findById(userId);

    if (!admin) {
      throw new UnauthorizedException();
    }

    const [salt, storedHash] = admin.password.split('.');
    const currentHash = (await scrypt(currentPassword, salt, 32)) as Buffer;

    // Compare the currentPassword with the admin password in database
    if (storedHash !== currentHash.toString('hex')) {
      throw new BadRequestException('Current password is not correct');
    }

    // The new password should not be the same as the older password
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Your new password cannot be the same as your current password',
      );
    }

    const hashedPassword = await this.hashPassword(
      newPassword,
      confirmPassword,
    );

    await this.adminService.updatePassword(userId, hashedPassword);
  }

  async forgotPassword(req: any, email: string) {
    const [admin] = await this.adminService.find(email);
    if (!admin) {
      throw new NotFoundException('The email do not exists.');
    }

    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);

    const resetToken = await this.adminService.savePasswordResetToken(
      admin,
      hashedToken,
      expiryTime,
    );

    if (!resetToken) {
      throw new InternalServerErrorException(
        'Failed to save password reset token.',
      );
    }

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    const emailBody = generatePasswordResetEmail(resetUrl);
    const subject = 'Password Reset';

    try {
      await this.mailerService.sendEmail(admin.email, subject, emailBody);
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to send email. Please try again later',
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const resetToken = await this.adminService.findAdminByToken(hashedToken);

    if (!resetToken || resetToken.expiryTime < new Date()) {
      throw new BadRequestException('Token is invalid or has expired.');
    }

    const hashedPassword = await this.hashPassword(
      newPassword,
      confirmPassword,
    );

    await this.adminService.updatePassword(resetToken.admin.id, hashedPassword);
    await this.adminService.clearPasswordResetToken(resetToken.id);
    await this.adminService.cleanupExpiredTokens();
  }
}
