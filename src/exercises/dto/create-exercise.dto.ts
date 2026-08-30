import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: 'Barra' })
  equipment?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Press con banca a 45 grados' })
  description?: string;
}
