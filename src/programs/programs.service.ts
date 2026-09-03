import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsRepository } from './programs.repository';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly programsRepository: ProgramsRepository) {}

  async create(dto: CreateProgramDto, userId: number) {
    return await this.programsRepository.create(dto, userId);
  }

  async findAll(userId: number, includeArchived?: boolean) {
    return await this.programsRepository.findAll(userId, includeArchived);
  }

  async findOne(id: number, userId: number) {
    const program = await this.programsRepository.findOne(id, userId);

    if (!program)
      throw new NotFoundException('Program not found for this user');

    return program;
  }

  async update(id: number, userId: number, dto: UpdateProgramDto) {
    const program = await this.programsRepository.findOne(id, userId);

    if (!program)
      throw new NotFoundException('Program not found for this user');

    return await this.programsRepository.update(id, dto);
  }
}
