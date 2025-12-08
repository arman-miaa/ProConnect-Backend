"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServices = void 0;
const message_model_1 = require("./message.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.create(payload);
    return result;
});
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield message_model_1.Message.find({}).sort({ createdAt: -1 });
    return messages;
});
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield message_model_1.Message.findById(id);
    if (!message) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Message not found");
    }
    yield message_model_1.Message.findByIdAndDelete(id);
    return { id };
});
exports.MessageServices = {
    createMessage,
    getAllMessages,
    deleteMessage,
};
