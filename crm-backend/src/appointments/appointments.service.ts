import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAppointmentDto) {
    return this.prisma.appointment.create({ data });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: { client: true },
      orderBy: { date: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  update(id: number, data: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
