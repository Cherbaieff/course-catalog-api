import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilterAuthorDto } from './dto/filter-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorService: AuthorsService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.findOne(id);
  }

  @Get()
  async findAll(@Query() query: FilterAuthorDto) {
    return this.authorService.findAll(query);
  }

  @Post()
  async create(@Body() createAuthorsDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorsDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.delete(id);
  }
}
