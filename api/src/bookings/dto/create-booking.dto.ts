import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  spaceId!: number;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
