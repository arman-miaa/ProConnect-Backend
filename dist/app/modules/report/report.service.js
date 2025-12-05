"use strict";
// src/app/modules/report/report.service.ts
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
exports.ReportServices = void 0;
const report_model_1 = require("./report.model");
const createReport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newReport = yield report_model_1.Report.create(payload);
    return newReport;
});
const getAllReports = () => __awaiter(void 0, void 0, void 0, function* () {
    // অ্যাডমিনদের দেখার জন্য সমস্ত রিপোর্ট
    const reports = yield report_model_1.Report.find().populate("senderId", "name email role");
    return reports;
});
const updateReportStatus = (reportId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedReport = yield report_model_1.Report.findByIdAndUpdate(reportId, { status }, { new: true });
    return updatedReport;
});
exports.ReportServices = {
    createReport,
    getAllReports,
    updateReportStatus,
};
