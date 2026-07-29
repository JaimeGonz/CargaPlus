import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Press de banca inclinado' })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Pecho' })
  muscleGroup!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Barra' })
  equipment?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Press con banca a 45 grados' })
  description?: string;
}
