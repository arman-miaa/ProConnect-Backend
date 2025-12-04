"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.GenericService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// ──────────────────────────────────────────
// 🔥 GENERIC GET SINGLE
// ──────────────────────────────────────────
const getSingle = (Model, id, populate) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Model.findById(id);
    // Optional populate support (Fix for TS overload error)
    if (populate) {
        query.populate(populate);
    }
    const result = yield query.lean();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `${Model.modelName} not found.`);
    }
    return result;
});
// ──────────────────────────────────────────
// 🔥 GENERIC GET ALL (Filters + Pagination + Sorting)
// ──────────────────────────────────────────
const getAll = (Model_1, query_1, ...args_1) => __awaiter(void 0, [Model_1, query_1, ...args_1], void 0, function* (Model, query, filter = {}, populate) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // Add role-based filters + query filters
    const finalFilter = Object.assign({}, filter);
    // Sorting
    const sort = query.sortBy || "-createdAt";
    const resultsQuery = Model.find(finalFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    // Optional population support
    if (populate) {
        resultsQuery.populate(populate);
    }
    const results = yield resultsQuery.lean();
    const total = yield Model.countDocuments(finalFilter);
    return {
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
        data: results,
    };
});
// ──────────────────────────────────────────
// ❌ GENERIC SOFT DELETE
// ──────────────────────────────────────────
const deleteSingle = (Model, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `${Model.modelName} not found.`);
    }
    return result;
});
// ──────────────────────────────────────────
// 📦 EXPORT
// ──────────────────────────────────────────
exports.GenericService = {
    getSingle,
    getAll,
    deleteSingle,
};
