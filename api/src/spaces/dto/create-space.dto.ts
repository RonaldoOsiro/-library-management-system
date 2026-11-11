import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(1)
  capacity!: number;
}
