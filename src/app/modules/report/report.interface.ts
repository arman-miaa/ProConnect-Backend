// src/app/modules/report/report.interface.ts

import { Types } from "mongoose";

export enum ReportType {
  SERVICE_ISSUE = "SERVICE_ISSUE",
  USER_VIOLATION = "USER_VIOLATION",
  PAYMENT_ISSUE = "PAYMENT_ISSUE",
  BUG_REPORT = "BUG_REPORT",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface IReport {
  senderId: Types.ObjectId;
  type: ReportType;
  relatedEntityId?: Types.ObjectId | null;
  description: string;
  status: ReportStatus;
}
