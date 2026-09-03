import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post('programs/:programId/routines')
  async create(
    @Param('programId') programId: string,
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.routinesService.create(
      createRoutineDto,
      userId,
      Number(programId),
    );
  }

  @Get('routines')
  async findAll(@GetUser('userId') userId: number) {
    return await this.routinesService.findAll(userId);
  }

  @Get('routines/:id')
  async findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return await this.routinesService.findOne(Number(id), userId);
  }

  @Patch('routines/:id')
  async update(
    @Param('id') id: string,
    @GetUser('userId') userId: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    return await this.routinesService.update(
      Number(id),
      userId,
      updateRoutineDto,
    );
  }

  @Delete('routines/:id')
  async remove(@Param('id') id: string, @GetUser('userId') userId: number) {
    return await this.routinesService.remove(Number(id), userId);
  }
}
