import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BorrowStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { calculateFine } from './fine-calculator';

const LOAN_PERIOD_DAYS = 14;
const FINE_RATE_PER_DAY = 1;

@Injectable()
export class BorrowRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: CreateBorrowRequestDto) {
    const books = await this.prisma.book.findMany({
      where: { id: { in: data.bookIds } },
      select: { id: true },
    });
    const foundBookIds = new Set(books.map((book) => book.id));
    const missingBookId = data.bookIds.find((id) => !foundBookIds.has(id));
    if (missingBookId !== undefined) {
      throw new NotFoundException(`Book ${missingBookId} not found`);
    }

    const dueDate = data.dueDate
      ? new Date(data.dueDate)
      : new Date(Date.now() + LOAN_PERIOD_DAYS * 24 * 60 * 60 * 1000);

    return this.prisma.$transaction((transaction) =>
      Promise.all(
        data.bookIds.map((bookId) =>
          transaction.borrowRequest.create({
            data: { bookId, userId, dueDate },
            include: { book: true },
          }),
        ),
      ),
    );
  }

  findAll() {
    return this.prisma.borrowRequest.findMany({
      include: {
        book: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async update(id: number, data: UpdateBorrowRequestDto) {
    const borrowRequest = await this.prisma.borrowRequest.findUnique({
      where: { id },
    });
    if (!borrowRequest) {
      throw new NotFoundException(`Borrow request ${id} not found`);
    }
    if (borrowRequest.status === BorrowStatus.RETURNED) {
      throw new UnprocessableEntityException(
        'A returned borrow request cannot be updated',
      );
    }

    const returnDate =
      data.status === BorrowStatus.RETURNED ? new Date() : null;
    const fineAmount = returnDate
      ? calculateFine(borrowRequest.dueDate, returnDate, FINE_RATE_PER_DAY)
      : new Prisma.Decimal(0);

    return this.prisma.borrowRequest.update({
      where: { id },
      data: {
        status: data.status,
        returnedAt: returnDate,
        fineAmount,
      },
      include: {
        book: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
