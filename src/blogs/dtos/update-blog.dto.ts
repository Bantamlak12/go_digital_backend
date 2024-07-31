import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Exploring the Cosmos',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Exploring the Cosmos',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'An in-depth look at the wonders of space exploration...',
  })
  content?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://www.goo',
  })
  picture: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Selam Meke',
  })
  author?: string;

  @IsOptional()
  @ApiProperty({
    example: 'Space Science',
  })
  categories?: string[];
}
