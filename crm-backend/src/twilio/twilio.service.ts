import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private from: string;
  private contentSid: string;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.from = process.env.TWILIO_WHATSAPP_NUMBER!;
    this.contentSid = process.env.TWILIO_TEMPLATE_SID!;
  }

  async sendTemplateMessage(to: string, variables: Record<string, string>) {
    const contentVariables = JSON.stringify(variables);

    return this.client.messages.create({
      from: this.from,
      to: `whatsapp:${to}`,
      contentSid: this.contentSid,
      contentVariables,
    });
  }
}
