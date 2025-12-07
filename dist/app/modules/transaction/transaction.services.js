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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const transaction_model_1 = require("./transaction.model");
const transaction_interface_1 = require("./transaction.interface");
const order_interface_1 = require("../order/order.interface");
const mongoose_1 = require("mongoose");
const order_model_1 = require("../order/order.model");
// 💰 Seller balance check
const getSellerBalance = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const agg = yield transaction_model_1.Transaction.aggregate([
        { $match: { userId: sellerId, status: "SUCCESS" } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);
    let totalEarned = 0;
    let totalWithdrawn = 0;
    agg.forEach((item) => {
        if (item._id === transaction_interface_1.TransactionType.SETTLEMENT)
            totalEarned = item.total;
        if (item._id === transaction_interface_1.TransactionType.WITHDRAWAL)
            totalWithdrawn = item.total;
    });
    return totalEarned - totalWithdrawn;
});
// 💸 Successful order settlement to seller
const creditSeller = (order) => __awaiter(void 0, void 0, void 0, function* () {
    if (!order.isPaid)
        return;
    // ১. Seller settlement
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.sellerId,
        type: transaction_interface_1.TransactionType.SETTLEMENT,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: order.netAmount,
        description: `Order settlement (${order._id}). Net amount credited to seller.`,
    });
    // ২. Platform fee deduction (optional)
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.sellerId,
        type: transaction_interface_1.TransactionType.FEE,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: -order.platformFee,
        description: `Platform commission deducted for order ${order._id}.`,
    });
});
// 💰 Process refund for cancelled order
const processRefund = (order) => __awaiter(void 0, void 0, void 0, function* () {
    if (!order.isPaid)
        return { success: true, message: "Order was not paid. No refund needed." };
    // Update order status
    const orderUpdateResult = yield order_model_1.Order.findByIdAndUpdate(order._id, { orderStatus: order_interface_1.OrderStatus.REFUNDED }, { new: true }).lean();
    // Record refund transaction
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
// 💵 Seller withdrawal (immediate deduction)
const createWithdrawal = (sellerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Check balance
    const balance = yield getSellerBalance(sellerId);
    if (amount > balance)
        throw new Error("Insufficient balance for withdrawal.");
    // Create withdrawal transaction (amount negative for deduction)
    const withdrawal = yield transaction_model_1.Transaction.create({
        userId: sellerId,
        type: transaction_interface_1.TransactionType.WITHDRAWAL,
        status: transaction_interface_1.TransactionStatus.SUCCESS,
        amount: -amount,
        description: `Withdrawal of ${amount} initiated by seller.`,
    });
    return withdrawal;
});
// 📜 Get user's transaction history
const getMyTransactions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find(Object.assign({ userId }, query))
        .sort("-createdAt")
        .lean();
    return transactions;
});
// Get all transactions (admin)
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.Transaction.find({})
        .sort(query.sortBy || "-createdAt")
        .limit(query.limit || 10)
        .skip((query.page || 0) * (query.limit || 10))
        .lean();
    return result;
});
// Record initial payment for order
const recordInitialPayment = (order) => __awaiter(void 0, void 0, void 0, function* () {
    yield transaction_model_1.Transaction.create({
        relatedOrder: order._id,
        userId: order.clientId,
        type: transaction_interface_1.TransactionType.DEPOSIT,
        status: transaction_interface_1.TransactionStatus.INITIATED,
        amount: order.totalPrice,
        description: `Initial payment initiated for order ${order._id}`,
    });
});
// Update transaction status
const updateStatus = (orderId, status, validationData) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield transaction_model_1.Transaction.findOneAndUpdate({ orderId }, { status, paymentGatewayData: validationData, updatedAt: new Date() }, { new: true });
    return updated;
});
// Calculate seller financial summary
const calculateSellerSummary = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sellerObjectId = new mongoose_1.Types.ObjectId(sellerId);
    // Total earned (SETTLEMENT)
    const totalEarnedAgg = yield transaction_model_1.Transaction.aggregate([
        {
            $match: {
                userId: sellerObjectId,
                type: transaction_interface_1.TransactionType.SETTLEMENT,
                status: transaction_interface_1.TransactionStatus.SUCCESS,
            },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarned = ((_a = totalEarnedAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    // Total withdrawn (WITHDRAWAL)
    const totalWithdrawnAgg = yield transaction_model_1.Transaction.aggregate([
        {
            $match: {
                userId: sellerObjectId,
                type: transaction_interface_1.TransactionType.WITHDRAWAL,
                status: transaction_interface_1.TransactionStatus.SUCCESS,
            },
        },
        { $group: { _id: null, total: { $sum: { $abs: "$amount" } } } }, // use abs because amount negative
    ]);
    const totalWithdrawn = ((_b = totalWithdrawnAgg[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
    // Available balance
    const availableBalance = totalEarned - totalWithdrawn;
    return { totalEarned, totalWithdrawn, availableBalance };
});
exports.TransactionServices = {
    creditSeller,
    processRefund,
    createWithdrawal,
    getMyTransactions,
    getAllTransactions,
    recordInitialPayment,
    updateStatus,
    calculateSellerSummary,
};
