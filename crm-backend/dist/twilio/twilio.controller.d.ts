import { TwilioService } from './twilio.service';
export declare class TwilioController {
    private readonly twilioService;
    constructor(twilioService: TwilioService);
    sendTemplate(body: {
        to: string;
        vars: Record<string, string>;
    }): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
}
