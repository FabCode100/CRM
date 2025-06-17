import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        price: number | null;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(clientId?: string, date?: string, time?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        price: number | null;
        status: string;
        notes: string | null;
        clientId: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__AppointmentClient<({
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
        price: number | null;
        status: string;
        notes: string | null;
        clientId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        price: number | null;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        date: Date;
        service: string;
        price: number | null;
        status: string;
        notes: string | null;
        clientId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
