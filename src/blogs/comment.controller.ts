import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('comments')
export class CommentsController {
  @Post('/')
  createComment(@Body() body: CreateCommentDto) {}

  @Get('/')
  getAllComments() {}

  @Get('/:id')
  getComment(@Param('id') id: string) {}

  @Delete('/:id')
  deleteComment(@Param('id') id: string) {}
}
