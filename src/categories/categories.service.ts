import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  private async filterCategory({
    search,
    page,
    limit,
    sortBy,
    sortOrder,
  }: FilterCategoryDto) {
    const whereClause = {
      ...(search && {
        name: {
          contains: search,
          mode: QueryMode.insensitive,
        },
      }),
    };

    const [categories, categoriesRecord] = await Promise.all([
      this.prismaService.category.findMany({
        where: whereClause,
        ...(page && limit && { skip: (page - 1) * limit, take: limit }),
        orderBy: {
          [sortBy || 'name']: sortOrder || 'asc',
        },
      }),
      this.prismaService.category.count({
        where: whereClause,
      }),
    ]);

    return {
      data: categories,
      count: categoriesRecord,
      page: page || 1,
      limit: limit || 10,
    };
  }

  private async findCategory(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`The category of ${id} does not exist`);
    }

    return category;
  }

  async findAll(filterCategoryDto: FilterCategoryDto) {
    return this.filterCategory(filterCategoryDto);
  }

  async findOne(id: number) {
    return this.findCategory(id);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({ data: createCategoryDto });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findCategory(id);
    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: number) {
    await this.findCategory(id);

    return this.prismaService.category.delete({ where: { id } });
  }
}
