import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My New Blog Post updated',
    description: 'Title of the blog post.',
  })
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'my-new-blog-post',
    description: 'Part of a url and for SEO ranking',
  })
  slug: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This is the updated content of the blog post.',
    description: 'Main content of the blog post.',
  })
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Add image for your blog post.',
  })
  picture: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Selam Melaku',
    description: 'Name of the author that writes the post.',
  })
  author: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiProperty({
    example: ['category-id-1', 'category-id-3'],
    description: 'Categories of the blog.',
    type: [String],
  })
  categoryIds?: string[];
}
