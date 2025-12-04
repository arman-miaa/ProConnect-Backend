"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/transaction/transaction.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const transaction_interface_1 = require("./transaction.interface");
const order_interface_1 = require("../order/order.interface"); // 💡 আপনার Order Interface
const order_model_1 = require("../order/order.model"); // 💡 আপনার Order Model
// 💸 ১. সফল অর্ডার থেকে সেলারকে টাকা দেওয়া (Called from Order Service: completeOrder)
const creditSeller = (order) => __awaiter(void 0, void 0, void 0, function* () {
    if (order.isPaid === false)
        return;
    // 1. সেলার সেটেলমেন্ট রেকর্ড
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.sellerId,
        type: transaction_interface_1.TransactionType.SETTLEMENT,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: order.netAmount,
        description: `Order settlement (${order._id}). Net amount credited to seller.`,
    });
    // 2. প্ল্যাটফর্ম ফি রেকর্ড
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.sellerId, // সেলারের পক্ষ থেকে ফি কাটা হয়েছে ধরে নেওয়া হচ্ছে
        type: transaction_interface_1.TransactionType.FEE,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: -order.platformFee, // নেগেটিভ অ্যামাউন্ট দিয়ে ফি রেকর্ড করা (ঐচ্ছিক)
        description: `Platform commission deducted for order ${order._id}.`,
    });
    // 3. 💡 (এখানে WalletService.credit() কল হবে)
});
// 💰 ২. বাতিল অর্ডারের জন্য রিফান্ড প্রসেস করা (Called from Order Service: cancelOrder)
const processRefund = (order) => __awaiter(void 0, void 0, void 0, function* () {
    if (!order.isPaid) {
        return { success: true, message: "Order was not paid. No refund needed." };
    }
    // 1. রিফান্ড গেটওয়ে কল
    // 💡 await PaymentGateway.initiateRefund(order.paymentIntentId, order.totalPrice);
    // 2. অর্ডারের স্ট্যাটাস REFUNDED করা
    const orderUpdateResult = yield order_model_1.Order.findByIdAndUpdate(order._id, { orderStatus: order_interface_1.OrderStatus.REFUNDED }, { new: true }).lean();
    // 3. লেনদেন রেকর্ড
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.clientId,
        type: transaction_interface_1.TransactionType.REFUND,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: order.totalPrice,
        description: `Refund processed for cancelled order ${order._id}.`,
    });
    return orderUpdateResult;
});
// 💵 ৩. সেলারের টাকা উত্তোলনের অনুরোধ (Seller Initiated)
const createWithdrawal = (sellerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. ওয়ালেট ব্যালেন্স চেক (WalletService.getBalance() কল হবে)
    // 2. টাকা উত্তোলনের ট্রানজাকশন তৈরি
    const withdrawal = yield transaction_model_1.Transaction.create({
        userId: sellerId,
        type: transaction_interface_1.TransactionType.WITHDRAWAL,
        status: transaction_interface_1.TransactionStatus.PENDING,
        amount: amount,
        description: `Withdrawal request initiated by seller.`,
    });
    return withdrawal;
});
// 📜 ৪. ট্রানজাকশন হিস্টরি আনা
const getMyTransactions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find(Object.assign({ userId: userId }, query))
        .sort("-createdAt")
        .lean();
    return transactions;
});
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // 🚫 কোনো userId ফিল্টার নেই
    const result = yield transaction_model_1.Transaction.find({})
        .sort(query.sortBy || "-createdAt")
        .limit(query.limit || 10)
        .skip(query.page * query.limit || 0)
        .lean();
    return result;
});
const recordInitialPayment = (order) => __awaiter(void 0, void 0, void 0, function* () {
    // Create initial transaction record with INITIATED status
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        // user.userId এর পরিবর্তে সরাসরি order.clientId ব্যবহার করা ভালো,
        // কারণ ক্লায়েন্টই পেমেন্ট করছে।
        userId: order.clientId, // 👈 FIX: userId যোগ করা হয়েছে
        // 💡 FIX: আপনার TransactionType enum এর সঠিক মান ব্যবহার করুন।
        // যদি আপনার enum এ 'DEPOSIT' বা 'INITIAL' থাকে, তবে সেটি ব্যবহার করুন।
        type: transaction_interface_1.TransactionType.DEPOSIT, // 👈 FIX: type এ সঠিক Enum ভ্যালু দিন
        status: transaction_interface_1.TransactionStatus.INITIATED, // বা আপনার এনামের সঠিক মান
        amount: order.totalPrice,
        description: `Initial payment initiated for order ${String(order._id || "")}`,
    });
});
const updateStatus = (orderId, status, validationData) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield transaction_model_1.Transaction.findOneAndUpdate({ orderId }, {
        status,
        paymentGatewayData: validationData,
        updatedAt: new Date(),
    }, { new: true });
    return updated;
});
exports.TransactionServices = {
    creditSeller,
    processRefund,
    createWithdrawal,
    getMyTransactions,
    getAllTransactions,
    recordInitialPayment,
    updateStatus,
};
