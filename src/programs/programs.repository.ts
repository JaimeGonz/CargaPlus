import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { Program, ProgramStatus } from '@prisma/client';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProgramDto, userId: number): Promise<Program> {
    return await this.prisma.program.create({
      data: { ...dto, userId },
    });
  }

  async findOne(id: number, userId: number): Promise<Program | null> {
    return await this.prisma.program.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: number, includeArchived?: boolean): Promise<Program[]> {
    return await this.prisma.program.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { status: { not: ProgramStatus.ARCHIVED } }),
      },
    });
  }

  async update(id: number, dto: UpdateProgramDto) {
    return await this.prisma.program.update({
      where: { id },
      data: { ...dto },
    });
  }

  async activate(id: number, userId: number): Promise<Program> {
    return this.prisma.$transaction(async (tx) => {
      const currentActive = await tx.program.findFirst({
        where: { userId, status: ProgramStatus.ACTIVE },
      });

      if (currentActive && currentActive.id !== id) {
        await tx.program.update({
          where: { id: currentActive.id },
          data: { status: ProgramStatus.AVAILABLE },
        });
      }

      return tx.program.update({
        where: { id },
        data: { status: ProgramStatus.ACTIVE },
      });
    });
  }

  async deactivate(id: number): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { status: ProgramStatus.AVAILABLE },
    });
  }

  async archive(id: number): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { status: ProgramStatus.ARCHIVED, endDate: new Date() },
    });
  }

  async unarchive(id: number): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { status: ProgramStatus.AVAILABLE, endDate: null },
    });
  }

  async remove(id: number): Promise<Program> {
    return this.prisma.program.delete({
      where: { id },
    });
  }
}
