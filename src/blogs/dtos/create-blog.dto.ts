import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Exploring the Cosmos',
    description: 'Title of the blog post.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'exploring-the-cosmos',
    description: 'Part of a url and for SEO ranking',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'An in-depth look at the wonders of space exploration and the latest discoveries in astronomy.',
    description: 'Main content of the blog post.',
  })
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://www.google.com/u',
    description: 'Add image for your blog post.',
  })
  picture: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Selam Tadesse',
    description: 'Name of the author that writes the post.',
  })
  author: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiProperty({
    example: 'Science',
    description: 'Categories of the blog belong to.',
    type: [String],
  })
  categoryIds?: string[];
}
