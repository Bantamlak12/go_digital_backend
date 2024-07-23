import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { promisify } from 'util';

// Change the _scrypt function to promise-based to use await
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
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

  async signup(email: string, password: string, confirmPassword: string) {
    // Check if the email is already registered
    const admins = await this.adminService.find(email);

    // If the user is registered, return an error message
    if (admins.length) {
      throw new ConflictException('Email is in use.');
    }

    // Check if the password and confirmPassword do match
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    // Generate the salt and hash the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;

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

    // Compare the newPassword and confirmPassword
    if (newPassword !== confirmPassword) {
      throw new ConflictException('Passwords do not match.');
    }

    // The new password should not be the same as the older password
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Your new password cannot be the same as your current password',
      );
    }

    // Hash the password and save to database
    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    const hashedPassword = `${newSalt}.${newHash.toString('hex')}`;

    await this.adminService.updatePassword(userId, hashedPassword);
  }
}
