import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateGenreDto) {
    return this.withUniqueConstraintHandling(() =>
      this.prisma.genre.create({ data }),
    );
  }

  findAll() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
    return genre;
  }

  async update(id: number, data: UpdateGenreDto) {
    await this.findOne(id);
    return this.withUniqueConstraintHandling(() =>
      this.prisma.genre.update({ where: { id }, data }),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }

  private async withUniqueConstraintHandling<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A genre with this name already exists');
      }
      throw error;
    }
  }
}
