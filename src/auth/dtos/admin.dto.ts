import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AdminDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the admin',
  })
  email: string;
}
