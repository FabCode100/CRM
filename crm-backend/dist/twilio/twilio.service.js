"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const Twilio = require("twilio");
let TwilioService = class TwilioService {
    client;
    from;
    contentSid;
    constructor() {
        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.from = process.env.TWILIO_WHATSAPP_NUMBER;
        this.contentSid = process.env.TWILIO_TEMPLATE_SID;
    }
    async sendTemplateMessage(to, variables) {
        const contentVariables = JSON.stringify(variables);
        return this.client.messages.create({
            from: this.from,
            to: `whatsapp:${to}`,
            contentSid: this.contentSid,
            contentVariables,
        });
    }
};
exports.TwilioService = TwilioService;
exports.TwilioService = TwilioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TwilioService);
//# sourceMappingURL=twilio.service.js.map