import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'valdoc7@gmail.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña es muy corta' })
  @MaxLength(20, { message: 'La contraseña es muy larga' })
  @ApiProperty({ example: '12345678' })
  password!: string;
}
