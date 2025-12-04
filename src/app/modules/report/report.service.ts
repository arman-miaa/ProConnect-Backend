// src/app/modules/report/report.service.ts

import { IReport, ReportStatus } from "./report.interface";
import { Report } from "./report.model";

const createReport = async (payload: IReport) => {
  const newReport = await Report.create(payload);
  return newReport;
};

const getAllReports = async () => {
  // অ্যাডমিনদের দেখার জন্য সমস্ত রিপোর্ট
  const reports = await Report.find().populate("senderId", "name email role");
  return reports;
};

const updateReportStatus = async (reportId: string, status: ReportStatus) => {
  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { status },
    { new: true }
  );
  return updatedReport;
};

export const ReportServices = {
  createReport,
  getAllReports,
  updateReportStatus,
};
