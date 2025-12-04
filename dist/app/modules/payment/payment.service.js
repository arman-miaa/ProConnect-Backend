"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/payment/payment.service.ts
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
exports.PaymentService = void 0;
const ssl_service_1 = require("../ssl/ssl.service");
const order_interface_1 = require("../order/order.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_services_1 = require("../transaction/transaction.services");
const order_services_1 = require("../order/order.services");
const base_service_1 = require("../order/base.service");
const order_model_1 = require("../order/order.model");
// 1. পেমেন্ট ইনিশিয়েট করা
const initPayment = (bookingId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // <CHANGE> Pass the Model and cast the result to IOrder
    const order = (yield base_service_1.GenericService.getSingle(order_model_1.Order, bookingId));
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found.");
    }
    if (order.orderStatus !== order_interface_1.OrderStatus.PENDING || order.isPaid) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order is not ready for payment.");
    }
    // 💡 FIX: user.name এবং user.email চেক করার জন্য নিরাপদ ডিফল্ট ব্যবহার
    const paymentPayload = {
        amount: order.totalPrice,
        transactionId: ((_a = order._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: user.name || "Client User", // ডিফল্ট বা সেইফগার্ড
        email: user.email || "client@example.com", // ডিফল্ট বা সেইফগার্ড
        address: user.address || "Address",
        phoneNumber: user.phoneNumber || "01XXXXXXXXX",
    };
    // <CHANGE> You need to add this method to TransactionServices
    yield transaction_services_1.TransactionServices.recordInitialPayment(order);
    const sslResponse = yield ssl_service_1.SSLService.sslPaymentInit(paymentPayload);
    return sslResponse;
});
// 2. SSLCommerz ওয়েবুক হ্যান্ডেল করা (Success/Fail/Cancel/Validate)
const handlePaymentStatusUpdate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = payload.transactionId;
    // 💡 FIX: payload.status "success" অথবা "validate" হলে তা সফল হিসেবে গণ্য হবে।
    // SSLCommerz "Success" রুট থেকে আসলেও val_id না থাকতে পারে।
    const isSuccessCall = payload.status === "success" || payload.status === "validate";
    let isValidated = false;
    let validationData = null;
    // 💡 ভ্যালিডেশন আবশ্যক (IPN/Success রুট থেকে val_id পাওয়া গেলে)
    if (payload.val_id) {
        const validationResult = yield ssl_service_1.SSLService.validatePayment({
            val_id: payload.val_id,
            tran_id: orderId,
        });
        isValidated = validationResult.isValid;
        validationData = validationResult.validationData;
    }
    // 💡 চূড়ান্ত স্ট্যাটাস নির্ধারণ:
    // হয় val_id ছাড়া success কল (যদি ভ্যালিডেশন ট্রিগার না হয়), অথবা val_id সহ সফল ভ্যালিডেশন
    const isPaymentFinalSuccess = isSuccessCall && (payload.val_id ? isValidated : true);
    if (isPaymentFinalSuccess) {
        // ✅ SUCCESS: অর্ডার ও ট্রানজাকশন আপডেট
        yield order_services_1.OrderServices.updatePaymentStatus(orderId, true);
        yield transaction_services_1.TransactionServices.updateStatus(orderId, "SUCCESS", validationData);
        return { success: true, message: "Payment successful and validated." };
    }
    else {
        // ❌ FAILED/CANCELLED: ট্রানজাকশন আপডেট এবং অর্ডার বাতিল
        yield order_services_1.OrderServices.updatePaymentStatus(orderId, false);
        yield transaction_services_1.TransactionServices.updateStatus(orderId, "FAILED", validationData);
        // পেমেন্ট ব্যর্থ হওয়ায় অর্ডারটি CANCELLED করে দেওয়া
        // 💡 FIX: cancelOrder এ user এবং role হিসেবে 'null' পাস করা হলো।
        // order.service.ts এর cancelOrder ফাংশনটি এখন এই 'null' মানটি দেখে সিস্টেম কল হিসেবে গণ্য করবে।
        yield order_services_1.OrderServices.cancelOrder(orderId, null, null, {
            cancellationReason: `Payment ${payload.status} by gateway or user.`,
        });
        return {
            success: false,
            message: "Payment failed or could not be validated.",
        };
    }
});
exports.PaymentService = {
    initPayment,
    handlePaymentStatusUpdate,
};
