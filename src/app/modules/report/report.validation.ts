// src/app/modules/report/report.validation.ts

import { z } from "zod";
import { Types } from "mongoose";
import { ReportType, ReportStatus } from "./report.interface"; // আপনার ইন্টারফেস ফাইল থেকে

// 💡 Mongoose ObjectId ভ্যালিডেশন
const objectIdSchema = z.string().refine(
  (val) => {
    return Types.ObjectId.isValid(val);
  },
  {
    message: "Invalid MongoDB ObjectId format.",
  }
);

// 1. নতুন রিপোর্ট তৈরির ভ্যালিডেশন স্কিমা (User-এর জন্য)
const createReportValidationSchema = z.object({
  // 'senderId' টোকেন থেকে আসবে, তাই এখানে দরকার নেই, কিন্তু যদি বডিতে পাঠান তবে objectIdSchema ব্যবহার করতে পারেন।

  body: z.object({
    type: z.enum(
      [
        ReportType.SERVICE_ISSUE,
        ReportType.USER_VIOLATION,
        ReportType.PAYMENT_ISSUE,
        ReportType.BUG_REPORT,
        ReportType.OTHER,
      ],
      {
        required_error: "Report type is required.",
        invalid_type_error: "Report type must be one of the predefined types.",
      }
    ),

    relatedEntityId: z
      .union([objectIdSchema.nullable(), z.literal("")])
      .optional(), // ObjectId অথবা null/ফাঁকা গ্রহণ করবে

    description: z
      .string({
        required_error: "Description is required.",
      })
      .min(20, "Description must be at least 20 characters long.") // 💡 Min Length
      .max(1000, "Description cannot exceed 1000 characters."), // 💡 Max Length
  }),
});

// 2. অ্যাডমিন দ্বারা স্ট্যাটাস আপডেটের ভ্যালিডেশন স্কিমা (Admin-এর জন্য)
const updateReportStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      [
        ReportStatus.PENDING,
        ReportStatus.IN_REVIEW,
        ReportStatus.RESOLVED,
        ReportStatus.CLOSED,
      ],
      {
        required_error: "Status is required for update.",
        invalid_type_error: "Status must be a valid report status.",
      }
    ),
  }),
});

export const ReportValidations = {
  createReportValidationSchema,
  updateReportStatusValidationSchema,
};
