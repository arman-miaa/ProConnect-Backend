"use strict";
// src/app/modules/transaction/transaction.controller.ts
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
exports.TransactionControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const transaction_services_1 = require("./transaction.services");
// 💵 ১. সেলারের টাকা উত্তোলনের অনুরোধ
const createWithdrawal = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // userId হলো সেলারের ID
    const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { amount } = req.body;
    const result = yield transaction_services_1.TransactionServices.createWithdrawal(new mongoose_1.Types.ObjectId(sellerId), amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Withdrawal request initiated successfully.",
        data: result,
    });
}));
// 📜 ২. ট্রানজাকশন হিস্টরি দেখা (সেলার/ক্লায়েন্ট)
const getMyTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield transaction_services_1.TransactionServices.getMyTransactions(new mongoose_1.Types.ObjectId(userId), req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Transaction history retrieved successfully.",
        data: result,
    });
}));
const getAllTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // কোনো userId চেক করার দরকার নেই, শুধু Authorization চেক করা হয়েছে
    const result = yield transaction_services_1.TransactionServices.getAllTransactions(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All platform transactions retrieved successfully.",
        data: result,
    });
}));
exports.TransactionControllers = {
    createWithdrawal,
    getMyTransactions,
    getAllTransactions
};
