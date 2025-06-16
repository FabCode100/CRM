// appointments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: dto,
    });
  }

  findAll(clientId?: string, date?: string, time?: string) {
    const filters: any = {};

    if (clientId) {
      filters.clientId = parseInt(clientId);
    }

    if (date) {
      filters.date = date; 
    }

    if (time) {
      filters.time = time; 
    }

    return this.prisma.appointment.findMany({
      where: filters,
      include: {
        client: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  update(id: number, dto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
