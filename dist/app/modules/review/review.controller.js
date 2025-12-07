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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const review_services_1 = require("./review.services");
const review_model_1 = require("./review.model");
// -------------------------
// 📝 নতুন রিভিউ তৈরি
// -------------------------
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { clientId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    const result = yield review_services_1.ReviewServices.createReview(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Review submitted successfully!",
        data: result,
    });
}));
// -------------------------
// 🔍 নির্দিষ্ট সার্ভিসের রিভিউ
// -------------------------
const getReviewsByServiceId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const result = yield review_services_1.ReviewServices.getReviewsByServiceId(serviceId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews retrieved successfully.",
        data: result,
    });
}));
// -------------------------
// 💼 সেলারের সব সার্ভিসের রিভিউ
// -------------------------
const getReviewsBySellerId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.user.userId;
    const result = yield review_services_1.ReviewServices.getReviewsBySellerId(sellerId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Seller's reviews retrieved successfully.",
        data: result,
    });
}));
// -------------------------
// 👤 ক্লায়েন্টের নিজের রিভিউ
// -------------------------
const getMyReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield review_services_1.ReviewServices.getMyReviews(clientId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your submitted reviews retrieved successfully.",
        data: result,
    });
}));
// -------------------------
// 👑 ADMIN: সব রিভিউ
// -------------------------
const getAllReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find()
        .populate("clientId", "name email")
        .populate("sellerId", "name email")
        .populate("serviceId", "_id title");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All reviews retrieved successfully",
        data: reviews,
    });
}));
exports.ReviewControllers = {
    createReview,
    getReviewsByServiceId,
    getReviewsBySellerId,
    getMyReviews,
    getAllReviews,
};
