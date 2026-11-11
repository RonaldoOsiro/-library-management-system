import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { GenresModule } from './genres/genres.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GenresModule,
    BooksModule,
    BorrowRequestsModule,
    BookingsModule,
    UsersModule,
  ],
})
export class AppModule {}
