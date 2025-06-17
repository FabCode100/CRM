import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        birthday: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        birthday: Date | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        birthday: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateClientDto: UpdateClientDto): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        birthday: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: number;
        name: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        birthday: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
