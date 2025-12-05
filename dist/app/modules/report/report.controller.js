"use strict";
// src/app/modules/report/report.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const report_service_1 = require("./report.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const createReport = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // টোকেন থেকে senderId যোগ করা হলো
    const payload = Object.assign(Object.assign({}, req.body), { senderId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    const result = yield report_service_1.ReportServices.createReport(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Report submitted successfully. We will review it shortly.",
        data: result,
    });
}));
const getAllReports = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_service_1.ReportServices.getAllReports();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All reports retrieved for admin.",
        data: result,
    });
}));
const updateReportStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    const { status } = req.body;
    const result = yield report_service_1.ReportServices.updateReportStatus(reportId, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Report status updated successfully.",
        data: result,
    });
}));
exports.ReportControllers = {
    createReport,
    getAllReports,
    updateReportStatus,
};
