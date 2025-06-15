import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateClientDto) {
    return this.prisma.client.create({ data });
  }

  findAll() {
    return this.prisma.client.findMany();
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateClientDto) {
    return this.prisma.client.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}
