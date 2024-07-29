import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsString()
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    example: 'Smith',
    description: 'Last name of the user',
  })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the admin used to register.',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Password of the admin used to register.',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Confirm the password to register.',
  })
  confirmPassword: string;
}
