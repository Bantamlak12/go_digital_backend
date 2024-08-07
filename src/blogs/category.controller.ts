import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response as ExpressResponse } from 'express';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { AdminService } from 'src/admin/admin.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Categories } from './entities/category.entity';

@ApiTags('categories')
@Controller('catagories')
export class CategoriesController {
  constructor(
    private adminService: AdminService,
    @InjectRepository(Categories)
    private categoryRepo: Repository<Categories>,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'This endpoint creates a category.' })
  @ApiResponse({ status: 201 })
  async createCategory(
    @Body() body: CreateCategoryDto,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      const category = await this.adminService.create(this.categoryRepo, body);

      res.status(HttpStatus.CREATED).json({
        status: 'success',
        data: {
          category,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to create the category',
        error: err.merssage,
      });
    }
  }

  @Get('/')
  @ApiOperation({ summary: 'This endpoint is used to get all categories.' })
  @ApiResponse({ status: 200 })
  async getAllCategories(@Response() res: ExpressResponse) {
    try {
      const categories = await this.adminService.getAll(this.categoryRepo);
      res.status(HttpStatus.CREATED).json({
        status: 'success',
        results: categories.length,
        data: {
          categories,
        },
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to get all categories.',
        error: err.merssage,
      });
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'This endpoint is used to delete a category.' })
  @ApiResponse({ status: 204 })
  @ApiParam({
    name: 'id',
    description: 'The Id of the category to be deleted.',
  })
  async deleteCategory(
    @Param('id') id: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      await this.adminService.delete(this.categoryRepo, id);
      res.status(HttpStatus.NO_CONTENT).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        mesage: 'Failed to delete the category.',
        error: err.merssage,
      });
    }
  }
}
