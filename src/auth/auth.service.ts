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
}
