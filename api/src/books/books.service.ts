import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    await this.ensureGenreExists(data.genreId);
    return this.withIsbnConflictHandling(() =>
      this.prisma.book.create({ data }),
    );
  }

  async findAll(query: FindBooksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.BookWhereInput = {};

    if (query.genreId !== undefined) where.genreId = query.genreId;
    if (query.search?.trim()) {
      where.OR = [
        { title: { contains: query.search.trim(), mode: 'insensitive' } },
        { author: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { genre: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: number, data: UpdateBookDto) {
    await this.findOne(id);
    if (data.genreId !== undefined) await this.ensureGenreExists(data.genreId);
    return this.withIsbnConflictHandling(() =>
      this.prisma.book.update({ where: { id }, data }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
  }

  private async withIsbnConflictHandling<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }
}
