"use strict";
// src/app/modules/order/order.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const order_interface_1 = require("./order.interface");
const user_interface_1 = require("../user/user.interface");
const order_model_1 = require("./order.model");
const order_services_1 = require("./order.services");
const base_service_1 = require("./base.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// 1. 🛒 অর্ডার তৈরি
const createOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId, quantity } = req.body;
    const clientId = req.user.userId;
    const result = yield order_services_1.OrderServices.createOrder(clientId, {
        serviceId,
        quantity,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Order created successfully. Proceed to payment.",
        data: result,
    });
}));
// 2. 📜 সমস্ত অর্ডার আনা (জেনেরিক ফাংশন ব্যবহার করে)
const getAllOrders = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const userRole = req.user.role;
    let filter = {};
    // রোল অনুযায়ী ফিল্টার সেট করা
    if (userRole === user_interface_1.Role.CLIENT) {
        filter = { clientId: userId };
    }
    else if (userRole === user_interface_1.Role.SELLER) {
        filter = { sellerId: userId };
    }
    const result = yield order_services_1.OrderServices.getAllOrders(req.query, filter); // কাস্টম সার্ভিস ফাংশন কল
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Orders retrieved successfully.",
        data: result,
    });
}));
// 3. 🔍 একক অর্ডার আনা (জেনেরিক ফাংশন ব্যবহার করে)
// src/app/modules/order/order.controller.ts (getSingleOrder ফাংশনের ভেতর)
// ...
// src/app/modules/order/order.controller.ts (getSingleOrder ফাংশনের ভেতর)
// ...
const getSingleOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const loggedInUserId = req.user.userId.toString();
    const loggedInUserRole = req.user.role;
    const result = yield base_service_1.GenericService.getSingle(order_model_1.Order, orderId, "serviceId clientId sellerId" // clientId এবং sellerId পপুলেট করা হচ্ছে
    );
    // 💡 চূড়ান্ত FIX: result.clientId টি যদি ObjectId হয় (পপুলেট না হলে)
    // অথবা যদি এটি পপুলেশনের ফলে একটি অবজেক্ট হয় (যা ক্লায়েন্ট অবজেক্ট), 
    // তবে তার _id ব্যবহার করে স্ট্রিং এ রূপান্তর করা হলো।
    // clientId কে সঠিকভাবে বের করা: এটি একটি অবজেক্ট হতে পারে, তাই ._id চেক করা হলো।
    let orderClientIdString;
    if (result.clientId && typeof result.clientId === 'object' && result.clientId._id) {
        orderClientIdString = result.clientId._id.toString();
    }
    else {
        orderClientIdString = result.clientId.toString(); // যদি প্লেইন ObjectId থাকে
    }
    // sellerId কে সঠিকভাবে বের করা:
    let orderSellerIdString;
    if (result.sellerId && typeof result.sellerId === 'object' && result.sellerId._id) {
        orderSellerIdString = result.sellerId._id.toString();
    }
    else {
        orderSellerIdString = result.sellerId.toString();
    }
    // 🛡️ ইউজার অ্যাক্সেস চেক
    const isClient = orderClientIdString === loggedInUserId;
    const isSeller = orderSellerIdString === loggedInUserId;
    const isAdminOrSuperAdmin = loggedInUserRole === "ADMIN" || loggedInUserRole === "SUPER_ADMIN";
    // 💡 FIX: যদি কেউই না হয় (ক্লায়েন্ট, সেলার, অ্যাডমিন/সুপার অ্যাডমিন) তবে এরর থ্রো হবে।
    if (!isClient && !isSeller && !isAdminOrSuperAdmin) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You do not have permission to view this order.");
    }
    // 4. সফল রেসপন্স
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Order retrieved successfully.",
        data: result,
    });
}));
// 4. ⚙️ স্ট্যাটাস আপডেট (কমপ্লেক্স লজিক)
const updateOrderStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const _a = req.body, { orderStatus } = _a, updateData = __rest(_a, ["orderStatus"]);
    const userId = req.user.userId;
    const userRole = req.user.role;
    let result;
    // 🎯 রোল এবং স্ট্যাটাস চেকিং
    switch (orderStatus) {
        case order_interface_1.OrderStatus.ACCEPTED:
            // শুধুমাত্র সেলার ACCEPT করতে পারবে
            if (userRole !== user_interface_1.Role.SELLER) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only a seller can accept an order.");
            }
            result = yield order_services_1.OrderServices.acceptOrder(orderId, userId, updateData);
            break;
        case order_interface_1.OrderStatus.IN_PROGRESS: // 💡 ADDED: IN_PROGRESS লজিক
            // শুধুমাত্র সেলার IN_PROGRESS করতে পারবে
            if (userRole !== user_interface_1.Role.SELLER) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only a seller can change status to in progress.");
            }
            result = yield order_services_1.OrderServices.inProgressOrder(orderId, userId);
            break;
        case order_interface_1.OrderStatus.DELIVERED:
            // শুধুমাত্র সেলার DELIVER করতে পারবে
            if (userRole !== user_interface_1.Role.SELLER) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only a seller can mark as delivered.");
            }
            result = yield order_services_1.OrderServices.deliverOrder(orderId, userId, updateData);
            break;
        case order_interface_1.OrderStatus.COMPLETED:
            // শুধুমাত্র ক্লায়েন্ট COMPLETE করতে পারবে (এবং ট্রানজাকশন শুরু হবে)
            if (userRole !== user_interface_1.Role.CLIENT) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only the client can complete the order.");
            }
            result = yield order_services_1.OrderServices.completeOrder(orderId, userId);
            break;
        case order_interface_1.OrderStatus.CANCELLED:
            // সেলার বা ক্লায়েন্ট CANCEL করতে পারবে, এখানে রিফান্ড লজিক পরে যুক্ত হবে
            result = yield order_services_1.OrderServices.cancelOrder(orderId, userId, userRole, updateData);
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid or unauthorized status update.");
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Order status updated to ${orderStatus} successfully.`,
        data: result,
    });
}));
exports.OrderControllers = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
};
