"use strict";
// src/app/modules/report/report.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportValidations = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const report_interface_1 = require("./report.interface"); // আপনার ইন্টারফেস ফাইল থেকে
// 💡 Mongoose ObjectId ভ্যালিডেশন
const objectIdSchema = zod_1.z.string().refine((val) => {
    return mongoose_1.Types.ObjectId.isValid(val);
}, {
    message: "Invalid MongoDB ObjectId format.",
});
// 1. নতুন রিপোর্ট তৈরির ভ্যালিডেশন স্কিমা (User-এর জন্য)
const createReportValidationSchema = zod_1.z.object({
    // 'senderId' টোকেন থেকে আসবে, তাই এখানে দরকার নেই, কিন্তু যদি বডিতে পাঠান তবে objectIdSchema ব্যবহার করতে পারেন।
    body: zod_1.z.object({
        type: zod_1.z.enum([
            report_interface_1.ReportType.SERVICE_ISSUE,
            report_interface_1.ReportType.USER_VIOLATION,
            report_interface_1.ReportType.PAYMENT_ISSUE,
            report_interface_1.ReportType.BUG_REPORT,
            report_interface_1.ReportType.OTHER,
        ], {
            required_error: "Report type is required.",
            invalid_type_error: "Report type must be one of the predefined types.",
        }),
        relatedEntityId: zod_1.z
            .union([objectIdSchema.nullable(), zod_1.z.literal("")])
            .optional(), // ObjectId অথবা null/ফাঁকা গ্রহণ করবে
        description: zod_1.z
            .string({
            required_error: "Description is required.",
        })
            .min(20, "Description must be at least 20 characters long.") // 💡 Min Length
            .max(1000, "Description cannot exceed 1000 characters."), // 💡 Max Length
    }),
});
// 2. অ্যাডমিন দ্বারা স্ট্যাটাস আপডেটের ভ্যালিডেশন স্কিমা (Admin-এর জন্য)
const updateReportStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            report_interface_1.ReportStatus.PENDING,
            report_interface_1.ReportStatus.IN_REVIEW,
            report_interface_1.ReportStatus.RESOLVED,
            report_interface_1.ReportStatus.CLOSED,
        ], {
            required_error: "Status is required for update.",
            invalid_type_error: "Status must be a valid report status.",
        }),
    }),
});
exports.ReportValidations = {
    createReportValidationSchema,
    updateReportStatusValidationSchema,
};
