import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from 'src/admin/admin.service';
import { Blogs } from './entities/blogs.entity';
import { Categories } from './entities/category.entity';

const capitalizeString = (input: any): string => {
  if (!input) return;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

@Injectable()
export class BlogService {
  constructor(
    private adminService: AdminService,
    @InjectRepository(Blogs)
    private blogRepo: Repository<Blogs>,
    @InjectRepository(Categories)
    private categoryRepo: Repository<Categories>,
  ) {}

  private async checkAndReturnCategories(body: any) {
    if (!body.categoryIds) {
      return null;
    }

    const categories = await this.adminService.findByIds(
      this.categoryRepo,
      body.categoryIds,
    );

    if (categories.length !== body.categoryIds.length) {
      throw new NotFoundException('One or more categories not found.');
    }

    const categoryNames = categories.map((category) => category.name);

    return categoryNames;
  }

  async createBlog(body: any) {
    const categoryNames = await this.checkAndReturnCategories(body);

    const newBlog = await this.adminService.create(this.blogRepo, {
      title: body.title,
      slug: body.slug,
      content: body.content,
      picture: body.picture,
      author: capitalizeString(body.author),
      categories: categoryNames,
    });

    return newBlog;
  }

  async updateBlog(blogId: string, body: any) {
    try {
      const categoryNames = await this.checkAndReturnCategories(body);

      const updatedBlog = await this.adminService.getUpdate(
        this.blogRepo,
        blogId,
        {
          title: body.title,
          slug: body.slug,
          content: body.content,
          picture: body.picture,
          author: capitalizeString(body.author),
          categories: categoryNames,
        },
      );

      return updatedBlog;
    } catch (err) {
      console.error(err);
    }
  }
}
