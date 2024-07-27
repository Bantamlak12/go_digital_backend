import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'df784y43rS',
    description: 'Old password of the admin',
  })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'The new password of the admin',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Confirm the new password of the admin',
  })
  confirmPassword: string;
}
