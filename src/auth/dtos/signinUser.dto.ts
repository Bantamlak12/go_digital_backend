import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninAdminDto {
  @IsEmail()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the admin',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '12345678',
    description: 'Password of the admin',
  })
  password: string;
}
