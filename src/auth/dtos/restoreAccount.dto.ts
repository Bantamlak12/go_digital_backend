import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreAccountDto {
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
    description: 'Password of the admin use to register.',
  })
  password: string;
}
