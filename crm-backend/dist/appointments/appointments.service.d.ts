import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        client: {
            id: number;
            name: string;
            email: string;
            phone: string | null;
            createdAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        status: string;
        notes: string | null;
        clientId: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<({
        client: {
            id: number;
            name: string;
            email: string;
            phone: string | null;
            createdAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        status: string;
        notes: string | null;
        clientId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
