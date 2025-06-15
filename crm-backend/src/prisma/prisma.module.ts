import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Opcional: faz com que o PrismaService esteja disponível globalmente
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
