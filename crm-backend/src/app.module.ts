import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TwilioModule } from './twilio/twilio.module';

@Module({
  imports: [PrismaModule, ClientsModule, AppointmentsModule, AuthModule, UsersModule, TwilioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}