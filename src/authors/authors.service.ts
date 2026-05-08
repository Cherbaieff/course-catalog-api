import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class AuthorsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async findAuthorWithFilters({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  }: FilterAuthorDto) {
    const whereClause = {
      ...(search && {
        name: {
          contains: search,
          mode: QueryMode.insensitive,
        },
      }),
    };

    const [authors, authorsRecords] = await Promise.all([
      this.prismaService.author.findMany({
        where: whereClause,
        ...(sortBy && {
          orderBy: { [sortBy || name]: sortOrder || 'asc' },
        }),
        ...(page &&
          limit && {
            skip: (page - 1) * limit,
            take: limit,
          }),
      }),

      this.prismaService.author.count({ where: whereClause }),
    ]);

    return {
      data: authors,
      count: authorsRecords,
      page: page || 1,
      limit: limit || 10,
    };
  }

  async findAll(query: FilterAuthorDto) {
    return this.findAuthorWithFilters(query);
  }

  async findOne(id: number) {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(
        `The author with the provided ${id} is not found`,
      );
    }

    return author;
  }

  async create(createAuthorsDto: CreateAuthorDto) {
    return this.prismaService.author.create({
      data: createAuthorsDto,
    });
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorDto) {
    await this.findOne(id);

    return this.prismaService.author.update({
      where: { id },
      data: updateAuthorsDto,
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prismaService.author.delete({ where: { id } });
  }
}
