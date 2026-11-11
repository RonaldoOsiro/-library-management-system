import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: CreateBookingDto) {
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);
    if (startAt >= endAt) {
      throw new UnprocessableEntityException(
        'Booking end time must be later than its start time',
      );
    }

    const space = await this.prisma.space.findFirst({
      where: { id: data.spaceId, isActive: true },
      select: { id: true },
    });
    if (!space) throw new NotFoundException(`Space ${data.spaceId} not found`);

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const overlappingBooking = await transaction.booking.findFirst({
            where: {
              spaceId: data.spaceId,
              status: { not: BookingStatus.CANCELLED },
              startAt: { lt: endAt },
              endAt: { gt: startAt },
            },
            select: { id: true },
          });
          if (overlappingBooking) {
            throw new ConflictException(
              'The selected space is already booked for that time',
            );
          }

          return transaction.booking.create({
            data: { userId, spaceId: data.spaceId, startAt, endAt },
            include: { space: true },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        throw new ConflictException(
          'The selected space is already booked for that time',
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        space: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startAt: 'asc' },
    });
  }
}
