import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        password: string;
        role: string;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        password: string;
        role: string;
    } | null>;
    findById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        password: string;
        role: string;
    } | null>;
}
