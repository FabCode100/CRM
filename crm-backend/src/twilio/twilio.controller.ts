import { Controller, Post, Body } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('whatsapp')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('send-template')
  async sendTemplate(@Body() body: { to: string; vars: Record<string, string> }) {
    return this.twilioService.sendTemplateMessage(body.to, body.vars);
  }
}
