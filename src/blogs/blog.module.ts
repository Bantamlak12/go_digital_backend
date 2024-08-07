import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CategoriesController } from './category.controller';
import { AdminModule } from 'src/admin/admin.module';
import { Blogs } from './entities/blogs.entity';
import { Categories } from './entities/category.entity';
import { Comments } from './entities/comment.entity';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([Blogs, Categories, Comments]),
  ],
  controllers: [BlogController, CategoriesController],
  providers: [BlogService],
})
export class BlogModule {}
