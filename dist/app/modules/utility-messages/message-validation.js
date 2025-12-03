"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactFormSchema = void 0;
// src/validation/contact.validation.ts
const zod_1 = require("zod");
const message_interface_1 = require("./message-interface");
exports.contactFormSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    issueType: zod_1.z.nativeEnum(message_interface_1.IssueType),
    message: zod_1.z.string().min(10),
});
