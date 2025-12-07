"use strict";
// src/app/modules/transaction/transaction.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidations = void 0;
const zod_1 = require("zod");
// 💰 সেলারের টাকা উত্তোলনের জন্য ইনপুট ভ্যালিডেশন
const createWithdrawalSchema = zod_1.z.object({
    amount: zod_1.z
        .number({
        required_error: "Amount is required for withdrawal.",
    })
        .positive("Amount must be a positive number."),
});
// 📜 ট্রানজাকশন হিস্টরি কোয়েরি ভ্যালিডেশন
const transactionQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z
            .enum(["DEPOSIT", "FEE", "WITHDRAWAL", "REFUND", "SETTLEMENT"])
            .optional(),
        status: zod_1.z.enum(["SUCCESS", "PENDING", "FAILED", "INITIATED"]).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }),
});
exports.TransactionValidations = {
    createWithdrawalSchema,
    transactionQuerySchema,
};
