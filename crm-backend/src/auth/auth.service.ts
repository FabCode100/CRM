import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && await bcrypt.compare(dto.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Email ou senha inválidos');
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}
