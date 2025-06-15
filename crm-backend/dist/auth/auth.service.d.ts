import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(dto: LoginUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    login(dto: LoginUserDto): Promise<{
        access_token: string;
    }>;
}
