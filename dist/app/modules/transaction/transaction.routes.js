"use strict";
// src/app/modules/transaction/transaction.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequrest_1 = require("../../middlewares/validateRequrest");
const transaction_validation_1 = require("./transaction.validation");
const router = express_1.default.Router();
// 💵 সেলারের উত্তোলনের অনুরোধ
router.post("/withdrawal", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), // শুধুমাত্র সেলার পারবে
(0, validateRequrest_1.validateRequest)(transaction_validation_1.TransactionValidations.createWithdrawalSchema), transaction_controller_1.TransactionControllers.createWithdrawal);
router.get("/all-history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), transaction_controller_1.TransactionControllers.getAllTransactions);
// 📜 ব্যবহারকারীর নিজস্ব ট্রানজাকশন হিস্টরি
router.get("/my-history", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), transaction_controller_1.TransactionControllers.getMyTransactions);
router.get("/earnings/summary", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), // শুধুমাত্র সেলার
transaction_controller_1.TransactionControllers.getSellerFinancialSummary);
exports.TransactionRoutes = router;
