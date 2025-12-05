"use strict";
// src/app/modules/report/report.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("./report.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// 💡 যে কোনো ইউজার রিপোর্ট তৈরি করতে পারবে
router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), report_controller_1.ReportControllers.createReport);
// 💡 শুধুমাত্র অ্যাডমিন সমস্ত রিপোর্ট দেখতে পারবে
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), report_controller_1.ReportControllers.getAllReports);
// 💡 শুধুমাত্র অ্যাডমিন রিপোর্টের স্ট্যাটাস আপডেট করতে পারবে
router.patch("/:reportId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), report_controller_1.ReportControllers.updateReportStatus);
exports.ReportRoutes = router;
