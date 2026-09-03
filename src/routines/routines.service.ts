import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutinesRepository } from './routines.repository';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { ProgramsService } from '../programs/programs.service';

@Injectable()
export class RoutinesService {
  constructor(
    private readonly routinesRepository: RoutinesRepository,
    private readonly programsService: ProgramsService,
  ) {}

  async create(
    createRoutineDto: CreateRoutineDto,
    userId: number,
    programId: number,
  ) {
    const program = await this.programsService.findOne(programId, userId);

    if (!program)
      throw new NotFoundException('Program not found for this user');

    return this.routinesRepository.create(createRoutineDto, userId, programId);
  }

  async findOne(id: number, userId: number) {
    return this.routinesRepository.findOne(id, userId);
  }

  async findAll(userId: number) {
    return this.routinesRepository.findAll(userId);
  }

  async update(id: number, userId: number, dto: UpdateRoutineDto) {
    const routine = await this.routinesRepository.findOne(id, userId);

    if (!routine) throw new NotFoundException('Routine not found.');

    return this.routinesRepository.update(id, dto);
  }

  async remove(id: number, userId: number) {
    const routine = await this.routinesRepository.findOne(id, userId);

    if (!routine) throw new NotFoundException('Routine not found.');

    return this.routinesRepository.remove(id);
  }
}
