import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('catagories')
export class CategoriesController {
  @Post('/')
  createCategory(@Body() body: CreateCategoryDto) {}

  @Get('/')
  getAllCategories() {}

  @Get('/:id')
  getCategory(@Param('id') id: string) {}

  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {}
}
