"use strict";
// src/app/modules/transaction/transaction.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["FEE"] = "FEE";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["SETTLEMENT"] = "SETTLEMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["DEPOSIT"] = "DEPOSIT";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["INITIATED"] = "INITIATED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
