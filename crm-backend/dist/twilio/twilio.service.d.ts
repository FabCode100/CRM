export declare class TwilioService {
    private client;
    private from;
    private contentSid;
    constructor();
    sendTemplateMessage(to: string, variables: Record<string, string>): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
}
