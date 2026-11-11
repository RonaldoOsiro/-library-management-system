import { BorrowStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateBorrowRequestDto {
  @IsEnum(BorrowStatus)
  status!: BorrowStatus;
}
