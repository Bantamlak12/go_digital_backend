import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CommentStatus } from '../entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Scarlet',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Johnson',
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This is updated comment for the blog.',
  })
  content?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
