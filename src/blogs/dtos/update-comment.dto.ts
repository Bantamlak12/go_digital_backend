import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CommentStatus } from '../entities/comment.entity';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
