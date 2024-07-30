import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('blogs')
export class BlogController {
  @Post('/')
  createBlog(@Body() body: CreateBlogDto) {}

  @Get('/')
  getAllBlogs() {}

  @Get('/:id')
  getBlog(@Param('id') id: string) {}

  @Patch('/:id')
  updateBlog(@Body() body: UpdateBlogDto, @Param('id') id: string) {}

  @Delete('/:id')
  deleteBlog(@Param('id') id: string) {}

  @Post('/:id/comments')
  addComment(@Body() body: CreateCommentDto, @Param('id') id: string) {}

  @Get('/:id/comments')
  getComments(@Param('id') id: string) {}

  @Get('/:id/comments/:commentId')
  getComment(@Param('id') id: string, @Param('commentId') commentId: string) {}

  @Post('/:id/categories')
  addCategory(@Param('id') id: string) {}
}
