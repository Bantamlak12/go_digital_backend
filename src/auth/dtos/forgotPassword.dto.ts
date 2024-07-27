import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the admin',
  })
  email: string;
}
