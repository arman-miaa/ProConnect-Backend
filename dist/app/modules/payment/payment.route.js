"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const payment_controller_1 = require("./payment.controller");
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
router.post("/init-payment/:bookingId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.CLIENT), payment_controller_1.PaymentControllers.initPayment);
router.post("/success", (0, cors_1.default)({ origin: true, credentials: true }), payment_controller_1.PaymentControllers.successPayment);
router.post("/fail", (0, cors_1.default)({ origin: true, credentials: true }), payment_controller_1.PaymentControllers.failPayment);
router.post("/cancel", (0, cors_1.default)({ origin: true, credentials: true }), payment_controller_1.PaymentControllers.cancelPayment);
router.get("/invoice/:paymentId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, cors_1.default)({ origin: true, credentials: true }), payment_controller_1.PaymentControllers.getInvoiceDownloadUrl);
router.post("/validate-payment", (0, cors_1.default)({ origin: true, credentials: true }), payment_controller_1.PaymentControllers.validatePayment);
exports.PaymentRoutes = router;
