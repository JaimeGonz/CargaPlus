import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  async create(
    @Body() createProgramDto: CreateProgramDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.programsService.create(createProgramDto, userId);
  }

  @Get()
  async findAll(
    @Query('archived') archived: string,
    @GetUser('userId') userId: number,
  ) {
    const includeArchived = archived === 'true';
    return await this.programsService.findAll(userId, includeArchived);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return await this.programsService.findOne(Number(id), userId);
  }
}
