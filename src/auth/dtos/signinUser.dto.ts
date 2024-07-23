import { IsString, IsEmail } from 'class-validator';

export class SigninAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
