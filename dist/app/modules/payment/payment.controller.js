"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/payment/payment.controller.ts
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
exports.PaymentControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const payment_service_1 = require("./payment.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const env_1 = require("../../config/env");
// 1. পেমেন্ট শুরু
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const user = req.user; // checkAuth middleware থেকে আসা ইউজার ডেটা
    // console.log("from payment controller","booking id",bookingId,"suer",user);
    const result = yield payment_service_1.PaymentService.initPayment(bookingId, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Payment initiation successful.",
        data: result, // { GatewayPageURL: "..." }
    });
}));
// 2. SSL SUCCESS Webhook/Redirect
// payment.controller.ts - Fix the type casting for query params
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.query || req.body;
    const updatedOrder = yield payment_service_1.PaymentService.handlePaymentStatusUpdate({
        transactionId: String(payload.tran_id || payload.transactionId || ""),
        amount: parseFloat(String(payload.amount || "0")),
        status: "success",
        val_id: payload.val_id ? String(payload.val_id) : undefined,
    });
    if (updatedOrder) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?orderId=${updatedOrder._id}`);
    }
    else {
        res.redirect(env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.query || req.body;
    // <CHANGE> Cast query params to string properly
    yield payment_service_1.PaymentService.handlePaymentStatusUpdate({
        transactionId: String(payload.tran_id || payload.transactionId || ""),
        amount: parseFloat(String(payload.amount || "0")),
        status: "fail",
    });
    res.redirect(env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL);
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.query || req.body;
    // <CHANGE> Cast query params to string properly
    yield payment_service_1.PaymentService.handlePaymentStatusUpdate({
        transactionId: String(payload.tran_id || payload.transactionId || ""),
        amount: parseFloat(String(payload.amount || "0")),
        status: "cancel",
    });
    res.redirect(env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL);
}));
// 4. IPN / Webhook (সার্ভার-টু-সার্ভার কল)
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Payment update handle
    const order = yield payment_service_1.PaymentService.handlePaymentStatusUpdate({
        transactionId: payload.tran_id,
        amount: parseFloat(payload.amount),
        status: "success",
        val_id: payload.val_id,
    });
    // order থাকলে SUCCESS, না থাকলে FAILED
    const status = order ? "SUCCESS" : "FAILED";
    res.status(http_status_codes_1.default.OK).json({
        status,
        message: "IPN processed.",
    });
}));
// 5. ইনভয়েস (আপনাকে এই লজিকটি পরে তৈরি করতে হবে)
const getInvoiceDownloadUrl = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 💡 টেম্পোরারি লজিক
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.NOT_IMPLEMENTED,
        success: false,
        message: "Invoice generation logic is not yet implemented.",
        data: null,
    });
}));
exports.PaymentControllers = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    validatePayment,
    getInvoiceDownloadUrl,
};
