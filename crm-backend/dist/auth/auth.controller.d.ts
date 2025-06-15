import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginUserDto): Promise<{
        access_token: string;
    }>;
}
