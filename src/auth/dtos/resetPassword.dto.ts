import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'The admins new password',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Confirm the password to reset the password.',
  })
  confirmPassword: string;
}
