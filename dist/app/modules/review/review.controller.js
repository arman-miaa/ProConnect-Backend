"use strict";
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
exports.ReviewControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const review_services_1 = require("./review.services");
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // টোকেন থেকে clientId যোগ করা হলো
    const payload = Object.assign(Object.assign({}, req.body), { clientId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    const result = yield review_services_1.ReviewServices.createReview(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Review submitted successfully!",
        data: result,
    });
}));
const getReviewsByServiceId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const result = yield review_services_1.ReviewServices.getReviewsByServiceId(serviceId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Reviews retrieved successfully.",
        data: result,
    });
}));
// 💡 নতুন ফাংশন: সেলারের সমস্ত সার্ভিসের রিভিউ দেখা
const getReviewsBySellerId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sellerId } = req.params;
    const result = yield review_services_1.ReviewServices.getReviewsBySellerId(sellerId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Seller's reviews retrieved successfully.",
        data: result,
    });
}));
// 💡 নতুন ফাংশন: ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা
const getMyReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // টোকেন থেকে clientId নেওয়া
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield review_services_1.ReviewServices.getMyReviews(clientId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your submitted reviews retrieved successfully.",
        data: result,
    });
}));
exports.ReviewControllers = {
    createReview,
    getReviewsByServiceId,
    getReviewsBySellerId, // নতুন
    getMyReviews, // নতুন
};
