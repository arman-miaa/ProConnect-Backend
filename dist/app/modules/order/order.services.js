"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/order/order.service.ts
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
exports.OrderServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const service_model_1 = require("../service/service.model");
const order_model_1 = require("./order.model");
const order_interface_1 = require("./order.interface");
const user_interface_1 = require("../user/user.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_services_1 = require("../transaction/transaction.services");
// ⚙️ কনস্ট্যান্ট
const PLATFORM_COMMISSION_RATE = 0.1;
;
// =========================================================================
// ১. 🛒 অর্ডার তৈরি (Create Order)
// =========================================================================
const createOrder = (clientId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. সার্ভিস চেক
    const service = yield service_model_1.Service.findById(payload.serviceId);
    if (!service || service.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Service not found or currently unavailable.");
    }
    // =========================================================
    // 💡 নতুন লজিক: সক্রিয় অর্ডার চেক (Active Order Check)
    // =========================================================
    const activeOrderStatuses = [
        order_interface_1.OrderStatus.PENDING,
        order_interface_1.OrderStatus.ACCEPTED,
        order_interface_1.OrderStatus.IN_PROGRESS,
    ];
    // console.log(
    //   "Checking active orders for client:",
    //   clientId,
    //   "service:",
    //   payload.serviceId
    // );
    const existingActiveOrder = yield order_model_1.Order.findOne({
        clientId: new mongoose_1.Types.ObjectId(clientId),
        serviceId: new mongoose_1.Types.ObjectId(payload.serviceId),
        orderStatus: { $in: activeOrderStatuses },
    });
    // console.log("Existing active order:", existingActiveOrder);
    if (existingActiveOrder) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an active order for this service. Please wait for the current one to complete or cancel it before ordering again.");
    }
    // =========================================================
    const sellerId = service.sellerId;
    const unitPrice = service.price;
    // 2. 💵 আর্থিক হিসাব
    const totalPrice = unitPrice * payload.quantity;
    const platformFee = totalPrice * PLATFORM_COMMISSION_RATE;
    const netAmount = totalPrice - platformFee;
    // 3. 📝 অর্ডারের ডেটা
    const orderData = {
        serviceId: new mongoose_1.Types.ObjectId(payload.serviceId),
        clientId: new mongoose_1.Types.ObjectId(clientId),
        sellerId: sellerId,
        totalPrice,
        platformFee,
        netAmount,
        // ⚠️ TEMP: পেমেন্ট ফ্লো তৈরি না হওয়া পর্যন্ত
        paymentIntentId: "TEMP_PID_" + new mongoose_1.Types.ObjectId().toString(),
    };
    const newOrder = yield order_model_1.Order.create(orderData);
    return newOrder;
});
// =========================================================================
// ২. 📜 সমস্ত অর্ডার আনা (Get All Orders)
// =========================================================================
const getAllOrders = (query, filter) => __awaiter(void 0, void 0, void 0, function* () {
    // 💡 এখানে GenericService.getAll কল হবে
    // আমি এখানে সহজ করে দিচ্ছি:
    const result = yield order_model_1.Order.find(filter)
        .populate("serviceId")
        .sort(query.sortBy || "-createdAt")
        .lean();
    return result;
});
// =========================================================================
// ৩. ⚙️ স্ট্যাটাস পরিবর্তন লজিক: ACCEPT
// =========================================================================
const acceptOrder = (orderId, sellerId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    // 1. সুরক্ষা চেক: অর্ডার সেলারের কিনা
    if (!order || order.sellerId.toString() !== sellerId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Order not found or you are not the seller.");
    }
    // 2. স্ট্যাটাস চেক: PENDING না হলে ACCEPT করা যাবে না
    if (order.orderStatus !== order_interface_1.OrderStatus.PENDING) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Order status must be ${order_interface_1.OrderStatus.PENDING} to be accepted.`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, {
        orderStatus: order_interface_1.OrderStatus.ACCEPTED,
        deliveryDate: updateData.deliveryDate, // ডেলিভারি ডেট আপডেট
    }, { new: true });
    return result;
});
const inProgressOrder = (orderId, sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    // 1. সুরক্ষা চেক: অর্ডার সেলারের কিনা
    if (!order || order.sellerId.toString() !== sellerId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Order not found or you are not the seller.");
    }
    // 2. স্ট্যাটাস চেক: ACCEPTED না হলে IN_PROGRESS করা যাবে না
    if (order.orderStatus !== order_interface_1.OrderStatus.ACCEPTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Order status must be ${order_interface_1.OrderStatus.ACCEPTED} to start work (IN_PROGRESS).`);
    }
    // 3. আপডেট
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, { orderStatus: order_interface_1.OrderStatus.IN_PROGRESS }, { new: true });
    return result;
});
// =========================================================================
// ৪. ⚙️ স্ট্যাটাস পরিবর্তন লজিক: DELIVER
// =========================================================================
const deliverOrder = (orderId, sellerId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order || order.sellerId.toString() !== sellerId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Order not found or you are not the seller.");
    }
    if (order.orderStatus !== order_interface_1.OrderStatus.ACCEPTED &&
        order.orderStatus !== order_interface_1.OrderStatus.IN_PROGRESS) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order must be accepted or in progress to be delivered.");
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, {
        orderStatus: order_interface_1.OrderStatus.DELIVERED,
        deliveryNote: updateData === null || updateData === void 0 ? void 0 : updateData.deliveryNote,
        deliveredFiles: updateData === null || updateData === void 0 ? void 0 : updateData.deliveredFiles,
    }, { new: true });
    return result;
});
// =========================================================================
// ৫. ⚙️ স্ট্যাটাস পরিবর্তন লজিক: COMPLETE
// =========================================================================
const completeOrder = (orderId, clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    // 1. সুরক্ষা চেক: ক্লায়েন্ট এবং স্ট্যাটাস
    if (!order || order.clientId.toString() !== clientId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Order not found or you are not the client.");
    }
    if (order.orderStatus !== order_interface_1.OrderStatus.DELIVERED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only delivered orders can be completed.");
    }
    // 2. স্ট্যাটাস COMPLETED করা
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, { orderStatus: order_interface_1.OrderStatus.COMPLETED }, { new: true });
    // 3. 💸 ট্রানজাকশন লজিক যুক্ত করা (সেটেলমেন্ট)
    if (result) {
        // 💡 TransactionService কল: সেলারকে টাকা দেওয়ার প্রক্রিয়া শুরু করা
        yield transaction_services_1.TransactionServices.creditSeller(result);
    }
    return result;
});
// =========================================================================
// ৬. ⚙️ স্ট্যাটাস পরিবর্তন লজিক: CANCEL
// =========================================================================
const cancelOrder = (orderId, userId, userRole, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. অর্ডার আনা
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found.");
    }
    // 2. প্রাথমিক স্ট্যাটাস চেক (PENDING বা ACCEPTED না হলে ক্যানসেল করা যাবে না)
    if (order.orderStatus !== order_interface_1.OrderStatus.PENDING &&
        order.orderStatus !== order_interface_1.OrderStatus.ACCEPTED &&
        order.orderStatus !== order_interface_1.OrderStatus.IN_PROGRESS // IN_PROGRESS এও ক্যানসেল হতে পারে
    ) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only PENDING, ACCEPTED, or IN_PROGRESS orders can be cancelled.");
    }
    // 3. সুরক্ষা: সঠিক ইউজার কিনা
    const isSystemCall = userId === null && userRole === null; // 💡 SSLCommerz ওয়েবুক কল বাইপাস
    if (!isSystemCall) {
        if (order.clientId.toString() !== userId &&
            order.sellerId.toString() !== userId &&
            userRole !== user_interface_1.Role.ADMIN &&
            userRole !== user_interface_1.Role.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to cancel this order.");
        }
    }
    // 4. স্ট্যাটাস CANCELLED করা
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, {
        orderStatus: order_interface_1.OrderStatus.CANCELLED,
        cancellationReason: updateData.cancellationReason || "No reason provided.",
    }, { new: true });
    // 5. 💰 রিফান্ড লজিক (যদি isPaid === true হয়)
    if (result && result.isPaid) {
        // 💡 TransactionService কল: রিফান্ড প্রক্রিয়া শুরু করা
        yield transaction_services_1.TransactionServices.processRefund(result);
    }
    return result;
});
// order.services.ts - Add this method
const updatePaymentStatus = (orderId, isPaid) => __awaiter(void 0, void 0, void 0, function* () {
    const newStatus = isPaid ? order_interface_1.OrderStatus.PENDING : order_interface_1.OrderStatus.PENDING;
    const updated = yield order_model_1.Order.findByIdAndUpdate(orderId, {
        isPaid,
        orderStatus: newStatus,
        paidAt: isPaid ? new Date() : null,
    }, { new: true });
    return updated;
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
    acceptOrder,
    inProgressOrder,
    deliverOrder,
    completeOrder,
    cancelOrder,
    updatePaymentStatus,
    // getSingleOrder এর জন্য GenericService ব্যবহার করা হবে
};
