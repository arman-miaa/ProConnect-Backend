"use strict";
// src/app/modules/order/order.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_interface_1 = require("../user/user.interface");
const order_validation_1 = require("./order.validation");
const order_controller_1 = require("./order.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequrest_1 = require("../../middlewares/validateRequrest");
const router = express_1.default.Router();
// 1. 🛒 অর্ডার তৈরি (POST /orders) - ক্লায়েন্ট
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.CLIENT), (0, validateRequrest_1.validateRequest)(order_validation_1.createOrderSchema), order_controller_1.OrderControllers.createOrder);
// 2. 📜 সমস্ত অর্ডার আনা (GET /orders) - ক্লায়েন্ট/সেলার/অ্যাডমিন
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), order_controller_1.OrderControllers.getAllOrders);
// 4. 🔍 একক অর্ডার আনা (GET /orders/:orderId) - ক্লায়েন্ট/সেলার/অ্যাডমিন
router.get("/:orderId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), order_controller_1.OrderControllers.getSingleOrder);
// 3. ⚙️ স্ট্যাটাস আপডেট (PATCH /orders/:orderId) - ক্লায়েন্ট/সেলার
router.patch("/:orderId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.CLIENT, user_interface_1.Role.SELLER), (0, validateRequrest_1.validateRequest)(order_validation_1.updateOrderStatusSchema), order_controller_1.OrderControllers.updateOrderStatus);
exports.OrderRoutes = router;
