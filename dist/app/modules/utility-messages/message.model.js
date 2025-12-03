"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
// src/models/Message.model.js
const mongoose_1 = __importDefault(require("mongoose"));
const message_interface_1 = require("./message-interface");
const messageSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: null },
    issueType: {
        type: String,
        required: true,
        enum: Object.values(message_interface_1.IssueType),
        default: message_interface_1.IssueType.GENERAL,
    },
    message: { type: String, required: true, minlength: 10 },
}, { timestamps: true });
exports.Message = mongoose_1.default.model("Message", messageSchema);
