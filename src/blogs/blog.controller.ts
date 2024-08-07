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
import { Comments } from './entities/comment.entity';
import { BlogService } from './blog.service';
import { AdminService } from 'src/admin/admin.service';
import { Blogs } from 'src/blogs/entities/blogs.entity';

const capitalizeString = (input: any): string => {
  if (!input) return;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private adminService: AdminService,
    @InjectRepository(Blogs)
    private blogRepo: Repository<Blogs>,
    @InjectRepository(Comments)
    private commentRepo: Repository<Comments>,
  ) {}

  // Create a blog
  @Post('/')
  @ApiOperation({ summary: 'This endpoint creates a blog post' })
  @ApiResponse({ status: 201 })
  async createBlog(
    @Body() body: CreateBlogDto,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const blog = await this.blogService.createBlog(body);

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
        error: err.message,
      });
    }
  }

  // Get all blogs
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
        error: err.message,
      });
    }
  }

  // Get a specific blog
  @Get('/:blogId')
  @ApiOperation({ summary: 'This endpoint gets a specific blog.' })
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
        error: err.message,
      });
    }
  }

  // Update a specifiific blog
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
      const updatedBlog = await this.blogService.updateBlog(blogId, body);

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
        error: err,
      });
    }
  }

  @Delete('/:blogId')
  @ApiOperation({ summary: 'This endpoint is used to deleted a blog post.' })
  @ApiResponse({
    status: 204,
    description:
      'This API only return the status code 204 for successfull deletion',
  })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog to be updated.',
  })
  async deleteBlog(
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      await this.adminService.delete(this.blogRepo, blogId);

      res.status(HttpStatus.NO_CONTENT).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to delete your blog.',
        error: err,
      });
    }
  }

  @Post('/:blogId/comments')
  @ApiOperation({
    summary: 'This endpoint is used to create a comment for a blog.',
  })
  @ApiResponse({ status: 201 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog to be commented.',
  })
  async createComment(
    @Body() body: CreateCommentDto,
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const comment = await this.adminService.createBlog(
        this.blogRepo,
        this.commentRepo,
        blogId,
        {
          firstName: capitalizeString(body.firstName),
          lastName: capitalizeString(body.lastName),
          content: capitalizeString(body.content),
        },
      );

      res.status(HttpStatus.CREATED).json({
        status: 'success',
        data: comment,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to create your comment.',
        error: err,
      });
    }
  }

  @Get('/:blogId/comments')
  @ApiOperation({
    summary:
      'This endpoint is used to get all comments related to the blog post Id. The admin need to use this API to see all commment.',
  })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog post used to retrieve the comments.',
  })
  async getComments(
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const comments = await this.adminService.getAllBlogComments(
        this.commentRepo,
        blogId,
      );
      res.status(HttpStatus.OK).json({
        status: 'success',
        results: comments.length,
        data: comments,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to retrive all comments for the blog.',
        error: err.message,
      });
    }
  }

  @Get('/:blogId/approved-comments')
  @ApiOperation({
    summary: `This endpoint is used to get all approved comments related to the blog post Id.
      The frontend developer can use this API to display only the approved comments to the blog post.`,
  })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog post used to retrieve the comments.',
  })
  async getApprovedComments(
    @Param('blogId') blogId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const comments = await this.adminService.getAllApprovedBlogComments(
        this.commentRepo,
        blogId,
      );
      res.status(HttpStatus.OK).json({
        status: 'success',
        results: comments.length,
        data: comments,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to retrive all comments for the blog.',
        error: err.message,
      });
    }
  }

  @Get('/:blogId/comments/:commentId')
  @ApiOperation({
    summary:
      'This endpoint is used to get a specific comment for the blog post.',
  })
  @ApiResponse({ status: 200 })
  @ApiParam({
    name: 'blogId',
    description: 'Id of the blog post.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'Id of the comment.',
  })
  async getComment(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const comment = await this.adminService.getComment(
        this.commentRepo,
        blogId,
        commentId,
      );
      res.status(HttpStatus.OK).json({
        status: 'success',
        data: comment,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to retrive the comment for the blog.',
        error: err.message,
      });
    }
  }

  @Patch('/comments/:commentId')
  @ApiOperation({
    summary:
      'This endpoint is used to update a comment. Admin can only update the comment.',
  })
  async updateComment(
    @Body() body: UpdateCommentDto,
    @Param('commentId') commentId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const commentedComment = await this.adminService.getUpdate(
        this.commentRepo,
        commentId,
        body,
      );
      res.status(HttpStatus.OK).json({
        status: 'success',
        data: commentedComment,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to update the comment for the blog.',
        error: err.message,
      });
    }
  }

  @Delete('/comments/:commentId')
  @ApiOperation({
    summary: 'This endpoint is used to delete a comment.',
  })
  @ApiResponse({ status: 204 })
  @ApiParam({
    name: 'commentId',
    description: 'The Id of the comment to be deleted.',
  })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      await this.adminService.delete(this.commentRepo, commentId);
      res.status(HttpStatus.NO_CONTENT).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to delete the comment for the blog.',
        error: err.message,
      });
    }
  }
}
