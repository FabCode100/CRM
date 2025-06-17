export class CreateAppointmentDto {
  date: Date;
  service: string;
  price?: number;
  status?: string;
  notes?: string;
  clientId: number;
}
