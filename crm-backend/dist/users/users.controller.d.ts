import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        password: string;
        role: string;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        password: string;
        role: string;
    }[]>;
}
