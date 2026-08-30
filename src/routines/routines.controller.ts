import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  async create(
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.routinesService.create(createRoutineDto, userId);
  }

  @Get()
  async findAll(@GetUser('userId') userId: number) {
    return await this.routinesService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return await this.routinesService.findOne(Number(id), userId);
  }
}
