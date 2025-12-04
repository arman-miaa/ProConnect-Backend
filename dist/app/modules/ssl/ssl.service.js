"use strict";
// src/app/modules/ssl/ssl.service.ts (চূড়ান্ত সংশোধন)
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
exports.SSLService = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const config = env_1.envVars.SSL;
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = {
            store_id: config.STORE_ID,
            store_passwd: config.STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            // ব্যাকএন্ড URL
            success_url: `${config.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${config.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${config.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: config.SSL_IPN_URL,
            // 💡 কাস্টমার ডেটা (আবশ্যিক ফিল্ডগুলো যোগ করা হয়েছে)
            cus_name: payload.name,
            cus_email: payload.email,
            cus_phone: payload.phoneNumber,
            // কাস্টমার ঠিকানা (এই ফিল্ডগুলো পূরণ করা স্কিপিং-এর জন্য খুব জরুরি)
            cus_add1: payload.address || "Dhaka",
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000", // স্ট্রিং হিসেবে দেওয়া ভালো
            cus_country: "Bangladesh",
            // cus_fax: "01711111111", // অপশনাল, বাদ দেওয়া হলো
            // 💡 প্রোডাক্ট ও শিপিং ডেটা (পেমেন্ট মেথড সিলেকশন নিশ্চিত করার জন্য)
            shipping_method: "NO",
            product_name: "Service Order",
            product_category: "Service",
            product_profile: "general", // মাল্টিপল অপশন নিশ্চিত করে
            // শিপিং ইনফো (যদি শিপিং না থাকে, তবুও পূরণ করতে হয়)
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000, // নাম্বার হিসেবেও দেওয়া যায়
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: config.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.status) !== "SUCCESS") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, ((_b = response.data) === null || _b === void 0 ? void 0 : _b.failedreason) || "SSLCommerz payment initiation failed.");
        }
        return response.data; // { status: "SUCCESS", GatewayPageURL: "..." }
    }
    catch (error) {
        console.log("Payment Init Error Occured", error.message);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 💡 এই ফাংশনটি অপরিবর্তিত রাখা হলো
    try {
        const response = yield (0, axios_1.default)({
            method: "GET",
            url: `${config.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${config.STORE_ID}&store_passwd=${config.STORE_PASS}`,
        });
        const validationData = response.data;
        const status = (_a = validationData === null || validationData === void 0 ? void 0 : validationData[0]) === null || _a === void 0 ? void 0 : _a.status;
        if (status === "VALID" || status === "VALIDATED") {
            return {
                isValid: true,
                validationData,
            };
        }
        return {
            isValid: false,
            validationData,
        };
    }
    catch (error) {
        console.log("SSL Validation Error:", error.message);
        throw new AppError_1.default(401, `Payment Validation Error: ${error.message}`);
    }
});
exports.SSLService = {
    sslPaymentInit,
    validatePayment,
};
