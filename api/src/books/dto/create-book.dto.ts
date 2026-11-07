import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn!: string;

  @IsInt()
  @Min(0)
  totalCopies!: number;

  @IsInt()
  @Min(1)
  genreId!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear())
  publishedYear?: number;
}
