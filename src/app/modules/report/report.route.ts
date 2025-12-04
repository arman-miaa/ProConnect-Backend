// src/app/modules/report/report.route.ts

import express from "express";

import { ReportControllers } from "./report.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

// 💡 যে কোনো ইউজার রিপোর্ট তৈরি করতে পারবে
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  ReportControllers.createReport
);

// 💡 শুধুমাত্র অ্যাডমিন সমস্ত রিপোর্ট দেখতে পারবে
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReportControllers.getAllReports
);

// 💡 শুধুমাত্র অ্যাডমিন রিপোর্টের স্ট্যাটাস আপডেট করতে পারবে
router.patch(
  "/:reportId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReportControllers.updateReportStatus
);

export const ReportRoutes = router;
