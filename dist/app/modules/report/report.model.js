"use strict";
// src/app/modules/report/report.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const report_interface_1 = require("./report.interface");
const ReportSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // রিপের্টের বিষয়বস্তু (যেমন: SERVICE_ISSUE, USER_VIOLATION, BUG_REPORT)
    type: {
        type: String,
        enum: Object.values(report_interface_1.ReportType),
        required: true,
    },
    // কার সম্পর্কে রিপোর্ট (ঐচ্ছিক)
    relatedEntityId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(report_interface_1.ReportStatus),
        default: report_interface_1.ReportStatus.PENDING,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Report = (0, mongoose_1.model)("Report", ReportSchema);
