// src/app/modules/report/report.model.ts

import { Schema, model } from "mongoose";
import { IReport, ReportStatus, ReportType } from "./report.interface";


const ReportSchema = new Schema<IReport>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // রিপের্টের বিষয়বস্তু (যেমন: SERVICE_ISSUE, USER_VIOLATION, BUG_REPORT)
    type: {
      type: String,
      enum: Object.values(ReportType),
      required: true,
    },
    // কার সম্পর্কে রিপোর্ট (ঐচ্ছিক)
    relatedEntityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    // রিপোর্ট এর বিবরণ
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Report = model<IReport>("Report", ReportSchema);
