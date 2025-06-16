import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.create(dto);
    }

    @Get()
    findAll(
        @Query('clientId') clientId?: string,
        @Query('date') date?: string,
        @Query('time') time?: string,
    ) {
        return this.appointmentsService.findAll(clientId, date, time);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.appointmentsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
        return this.appointmentsService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(+id);
    }
}
