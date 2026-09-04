import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProgramDto } from './dto/update-program.dto';

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.programsService.update(
      Number(id),
      userId,
      updateProgramDto,
    );
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.programsService.activate(Number(id), userId);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.programsService.deactivate(Number(id), userId);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.programsService.archive(Number(id), userId);
  }
}
