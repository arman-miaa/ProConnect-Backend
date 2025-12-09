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
exports.AdminController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const service_model_1 = require("../service/service.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("../order/order.model");
const order_interface_1 = require("../order/order.interface");
const getDashboardStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 12 মাসের array
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    // 1️⃣ সাধারণ summary stats
    const [totalUsers, totalSellers, totalClients, totalAdmins, totalServices, totalOrders, successfulPayments, cancelledOrders, revenueStats, commissionStats,] = yield Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({ role: "SELLER" }),
        user_model_1.User.countDocuments({ role: "CLIENT" }),
        user_model_1.User.countDocuments({ role: "ADMIN" }),
        service_model_1.Service.countDocuments(),
        transaction_model_1.Transaction.countDocuments(),
        transaction_model_1.Transaction.countDocuments({ status: transaction_interface_1.TransactionStatus.SUCCESS }),
        order_model_1.Order.countDocuments({ orderStatus: order_interface_1.OrderStatus.CANCELLED }),
        // মোট revenue
        transaction_model_1.Transaction.aggregate([
            { $match: { status: transaction_interface_1.TransactionStatus.SUCCESS } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        // মোট commission
        transaction_model_1.Transaction.aggregate([
            {
                $match: {
                    type: transaction_interface_1.TransactionType.FEE,
                    status: transaction_interface_1.TransactionStatus.SUCCESS,
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
    ]);
    const totalRevenue = ((_a = revenueStats === null || revenueStats === void 0 ? void 0 : revenueStats[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const totalCommission = Math.abs(((_b = commissionStats === null || commissionStats === void 0 ? void 0 : commissionStats[0]) === null || _b === void 0 ? void 0 : _b.total) || 0);
    // 2️⃣ 12 মাসের Revenue & Commission
    const monthlyRevenueAgg = yield transaction_model_1.Transaction.aggregate([
        { $match: { status: transaction_interface_1.TransactionStatus.SUCCESS } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$amount" },
            },
        },
    ]);
    const monthlyCommissionAgg = yield transaction_model_1.Transaction.aggregate([
        {
            $match: {
                type: transaction_interface_1.TransactionType.FEE,
                status: transaction_interface_1.TransactionStatus.SUCCESS,
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                commission: { $sum: "$amount" },
            },
        },
    ]);
    const monthlyStats = months.map((month, index) => {
        const monthIndex = index + 1;
        const revenueEntry = monthlyRevenueAgg.find((r) => r._id === monthIndex);
        const commissionEntry = monthlyCommissionAgg.find((c) => c._id === monthIndex);
        return {
            month,
            revenue: (revenueEntry === null || revenueEntry === void 0 ? void 0 : revenueEntry.revenue) || 0,
            commission: (commissionEntry === null || commissionEntry === void 0 ? void 0 : commissionEntry.commission) || 0,
        };
    });
    // 3️⃣ 12 মাসের Orders (optional)
    const monthlyOrdersAgg = yield order_model_1.Order.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                completed: {
                    $sum: { $cond: [{ $eq: ["$orderStatus", "COMPLETED"] }, 1, 0] },
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ["$orderStatus", "CANCELLED"] }, 1, 0] },
                },
                pending: {
                    $sum: { $cond: [{ $eq: ["$orderStatus", "PENDING"] }, 1, 0] },
                },
            },
        },
    ]);
    const monthlyOrders = months.map((month, index) => {
        const monthIndex = index + 1;
        const entry = monthlyOrdersAgg.find((e) => e._id === monthIndex);
        return {
            month,
            completed: (entry === null || entry === void 0 ? void 0 : entry.completed) || 0,
            cancelled: (entry === null || entry === void 0 ? void 0 : entry.cancelled) || 0,
            pending: (entry === null || entry === void 0 ? void 0 : entry.pending) || 0,
        };
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Admin dashboard stats loaded successfully",
        data: {
            totalUsers,
            totalSellers,
            totalClients,
            totalAdmins,
            totalServices,
            totalOrders,
            cancelledOrders,
            successfulPayments,
            totalRevenue,
            totalCommission,
            monthlyStats, // 12 মাসের revenue & commission
            monthlyOrders, // 12 মাসের orders
        },
    });
}));
exports.AdminController = {
    getDashboardStats,
};
