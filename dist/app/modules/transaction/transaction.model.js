"use strict";
// src/app/modules/transaction/transaction.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionStatus),
        default: transaction_interface_1.TransactionStatus.INITIATED,
        required: true,
    },
    amount: { type: Number, required: true },
    relatedOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order" },
    paymentIntentId: { type: String },
    description: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
