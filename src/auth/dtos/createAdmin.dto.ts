import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsEmail()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the admin use to register.',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'df784y43rS',
    description: 'Password of the admin use to register.',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'df784y43rS',
    description: 'Confirm the password to register.',
  })
  confirmPassword: string;
}
