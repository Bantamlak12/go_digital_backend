import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Response as ExpressResponse } from 'express';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentStatus } from './entities/comment.entity';
import { BlogService } from './blog.service';
import { AdminService } from 'src/admin/admin.service';
import { Blogs } from 'src/blogs/entities/blogs.entity';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private adminService: AdminService,
    @InjectRepository(Blogs)
    private blogRepo: Repository<Blogs>,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'This endpoint creates a blog post' })
  @ApiResponse({ status: 201 })
  async createBlog(
    @Body() body: CreateBlogDto,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const blog = await this.adminService.create(this.blogRepo, body);

      res.status(HttpStatus.CREATED).json({
        status: 'success',
        data: {
          blog,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to create blog',
        Error: err.message,
      });
    }
  }

  @Get('/')
  @ApiOperation({ summary: 'This endpoint gets all blogs in the database.' })
  @ApiResponse({ status: 200 })
  async getAllBlogs(@Response() res: ExpressResponse): Promise<void> {
    try {
      const blogs = await this.adminService.getAll(this.blogRepo);

      res.status(HttpStatus.OK).json({
        status: 'success',
        results: blogs.length,
        data: {
          blogs,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to get blogs.',
        Error: err.message,
      });
    }
  }

  @Get('/:blogId')
  @ApiOperation({ summary: 'This endpoint get a specific blog.' })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog.',
  })
  async getBlog(
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const blog = await this.adminService.getOne(this.blogRepo, blogId);

      res.status(HttpStatus.OK).json({
        status: 'success',
        data: {
          blog,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to get blogs.',
        Error: err.message,
      });
    }
  }

  @Patch('/:blogId')
  @ApiOperation({ summary: 'This endpoint updates a specific blog post.' })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog.',
  })
  async updateBlog(
    @Body() body: UpdateBlogDto,
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const updatedBlog = await this.adminService.getUpdate(
        this.blogRepo,
        blogId,
        body,
      );

      res.status(HttpStatus.OK).json({
        status: 'success',
        data: {
          updatedBlog,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to update your blog.',
        Error: err,
      });
    }
  }

  @Delete('/:blogId')
  deleteBlog(@Param('id') blogId: string) {}

  @Post('/:blogId/comments')
  createComment(
    @Body() body: CreateCommentDto,
    @Param('blogId') blogId: string,
  ) {}

  @Get('/:blogId/comments')
  getComments(@Param('blogId') blogId: string) {}

  @Get('/:blogId/comments/:commentId')
  getComment(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
  ) {}

  @Patch('/comments/:commentId')
  updateComment(
    @Body() body: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {}

  @Patch('/comments/:commentId/status')
  updateCommentStatus(
    @Body() commentStatus: { status: CommentStatus },
    @Param('commentId') commentId: string,
  ) {}

  @Delete('/comments/:commentId')
  deleteComment(@Param('commentId') commentId: string) {}

  @Post('/:blogId/categories')
  addCategory(@Param('id') blogId: string) {}
}
