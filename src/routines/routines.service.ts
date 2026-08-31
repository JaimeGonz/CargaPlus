import { Injectable, NotFoundException } from '@nestjs/common';
import { RoutinesRepository } from './routines.repository';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(private readonly routinesRepository: RoutinesRepository) {}

  async create(createRoutineDto: CreateRoutineDto, userId: number) {
    return this.routinesRepository.create(createRoutineDto, userId);
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
