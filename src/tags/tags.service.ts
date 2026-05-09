import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FilterTagDto } from './dto/filter-tag.dto';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async findTagsWithFilters({
    search,
    sortBy,
    sortOrder,
    page,
    limit,
  }: FilterTagDto) {
    const whereClause = {
      ...(search && {
        name: { contains: search, mode: QueryMode.insensitive },
      }),
    };

    const [tags, tagsRecord] = await Promise.all([
      this.prismaService.tag.findMany({
        where: whereClause,
        orderBy: {
          [sortBy || 'name']: sortOrder || 'asc',
        },
        ...(page && limit && { skip: (page - 1) * limit, take: limit }),
      }),
      this.prismaService.tag.count({ where: whereClause }),
    ]);

    return {
      data: tags,
      count: tagsRecord,
      page: page || 1,
      limit: limit || 10,
    };
  }

  private async findExistingTag(id: number) {
    const tag = await this.prismaService.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException(`The tag of ${id} is not found`);
    }

    return tag;
  }

  async create(createTagDto: CreateTagDto) {
    return this.prismaService.tag.create({ data: createTagDto });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.findExistingTag(id);

    return this.prismaService.tag.update({ where: { id }, data: updateTagDto });
  }

  async findAll(query: FilterTagDto) {
    return this.findTagsWithFilters(query);
  }

  async findOne(id: number) {
    return this.findExistingTag(id);
  }

  async delete(id: number) {
    await this.findExistingTag(id);

    return this.prismaService.tag.delete({ where: { id } });
  }
}
