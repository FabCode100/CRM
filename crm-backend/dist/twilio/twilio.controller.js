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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioController = void 0;
const common_1 = require("@nestjs/common");
const twilio_service_1 = require("./twilio.service");
let TwilioController = class TwilioController {
    twilioService;
    constructor(twilioService) {
        this.twilioService = twilioService;
    }
    async sendTemplate(body) {
        return this.twilioService.sendTemplateMessage(body.to, body.vars);
    }
};
exports.TwilioController = TwilioController;
__decorate([
    (0, common_1.Post)('send-template'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwilioController.prototype, "sendTemplate", null);
exports.TwilioController = TwilioController = __decorate([
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [twilio_service_1.TwilioService])
], TwilioController);
//# sourceMappingURL=twilio.controller.js.map