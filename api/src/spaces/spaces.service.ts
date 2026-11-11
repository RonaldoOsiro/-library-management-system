import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(activeOnly = false) {
    return this.prisma.space.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  create(data: CreateSpaceDto) {
    return this.prisma.space.create({ data });
  }

  async update(id: number, data: UpdateSpaceDto) {
    await this.findOne(id);
    return this.prisma.space.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.space.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async findOne(id: number) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) throw new NotFoundException(`Space ${id} not found`);
    return space;
  }
}
