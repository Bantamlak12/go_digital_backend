import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from 'src/admin/admin.service';
import { Blogs } from './entities/blogs.entity';
import { Categories } from './entities/category.entity';

@Injectable()
export class BlogService {
  constructor(
    private adminService: AdminService,
    @InjectRepository(Blogs)
    private blogRepo: Repository<Blogs>,
    @InjectRepository(Categories)
    private categoryRepo: Repository<Categories>,
  ) {}
  async createBlog(body: any) {
    const category = await this.adminService.findByIds(
      this.categoryRepo,
      body.categoryIds,
    );
  }
}
