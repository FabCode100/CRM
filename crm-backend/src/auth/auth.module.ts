// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // caminho correto aqui
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,     // 🔥 Isso aqui resolve o problema!
    PassportModule,
    JwtModule.register({
      secret: 'sua-chave-secreta', // ou use process.env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
