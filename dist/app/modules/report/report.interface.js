"use strict";
// src/app/modules/report/report.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["SERVICE_ISSUE"] = "SERVICE_ISSUE";
    ReportType["USER_VIOLATION"] = "USER_VIOLATION";
    ReportType["PAYMENT_ISSUE"] = "PAYMENT_ISSUE";
    ReportType["BUG_REPORT"] = "BUG_REPORT";
    ReportType["OTHER"] = "OTHER";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["IN_REVIEW"] = "IN_REVIEW";
    ReportStatus["RESOLVED"] = "RESOLVED";
    ReportStatus["CLOSED"] = "CLOSED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
