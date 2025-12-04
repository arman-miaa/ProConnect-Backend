// src/app/modules/report/report.controller.ts

import { Request, Response } from "express";
import httpStatus from "http-status-codes"

import { ReportServices } from "./report.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createReport = catchAsync(async (req: Request, res: Response) => {
  // টোকেন থেকে senderId যোগ করা হলো
  const payload = { ...req.body, senderId: req.user?.userId };
  const result = await ReportServices.createReport(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Report submitted successfully. We will review it shortly.",
    data: result,
  });
});

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServices.getAllReports();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All reports retrieved for admin.",
    data: result,
  });
});

const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const result = await ReportServices.updateReportStatus(reportId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Report status updated successfully.",
    data: result,
  });
});

export const ReportControllers = {
  createReport,
  getAllReports,
  updateReportStatus,
};
