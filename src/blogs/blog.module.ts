import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CommentsController } from './comment.controller';
import { CategoriesController } from './category.controller';
import { AdminModule } from 'src/admin/admin.module';
import { Blogs } from './entities/blogs.entity';
import { Categories } from './entities/category.entity';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([Blogs, Categories]),
  ],
  controllers: [BlogController, CommentsController, CategoriesController],
  providers: [BlogService],
})
export class BlogModule {}
