"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = require("mongoose");
const withdrawal_interface_1 = require("./withdrawal.interface");
const withdrawalSchema = new mongoose_1.Schema({
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 10 }, // সর্বনিম্ন উত্তোলনের সীমা
    method: {
        type: String,
        enum: Object.values(withdrawal_interface_1.PaymentMethod),
        required: true,
    },
    accountDetails: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: Object.values(withdrawal_interface_1.WithdrawalStatus),
        default: withdrawal_interface_1.WithdrawalStatus.PENDING,
    },
    transactionId: { type: String },
}, { timestamps: true });
exports.Withdrawal = (0, mongoose_1.model)("Withdrawal", withdrawalSchema);
