import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CommentsController } from './comment.controller';
import { CategoriesController } from './category.controller';

@Module({
  controllers: [BlogController, CommentsController, CategoriesController],
  providers: [BlogService],
})
export class BlogModule {}
