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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
        mesage: 'Failed to create category',
        error: err.merssage,
      });
    }
  }

  // @Get('/')
  // getAllCategories() {}
  // @Get('/:id')
  // getCategory(@Param('id') id: string) {}
  // @Delete('/:id')
  // deleteCategory(@Param('id') id: string) {}
}
