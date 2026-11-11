import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBorrowRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  bookIds!: number[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
