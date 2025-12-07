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
exports.ReviewServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const order_model_1 = require("../order/order.model");
const review_model_1 = require("./review.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const service_model_1 = require("../service/service.model");
const user_model_1 = require("../user/user.model");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { orderId, clientId } = payload;
    // 1. Load Order
    const order = yield order_model_1.Order.findById(orderId);
    if (!order)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found.");
    // 2. Check if correct client
    if (order.clientId.toString() !== clientId.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to review this order.");
    }
    // 3. Check order is completed
    if (order.orderStatus !== "COMPLETED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Review can only be submitted for completed orders.");
    }
    // 4. Prevent duplicate reviews
    const existingReview = yield review_model_1.Review.findOne({ orderId });
    if (existingReview) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You have already reviewed this order.");
    }
    // 5. Add serviceId & sellerId from order
    const finalPayload = Object.assign(Object.assign({}, payload), { serviceId: order.serviceId, sellerId: order.sellerId, clientId });
    // 6. Create Review
    const newReview = yield review_model_1.Review.create(finalPayload);
    // ---------------------------
    // ⭐ 7. Update Service Ratings
    // ---------------------------
    const serviceStats = yield review_model_1.Review.aggregate([
        { $match: { serviceId: order.serviceId } },
        {
            $group: {
                _id: "$serviceId",
                avgRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]);
    yield service_model_1.Service.findByIdAndUpdate(order.serviceId, {
        averageRating: ((_a = serviceStats[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0,
        reviewCount: ((_b = serviceStats[0]) === null || _b === void 0 ? void 0 : _b.reviewCount) || 0,
    });
    // ---------------------------
    // ⭐ 8. Update Seller (User) Rating
    // ---------------------------
    const sellerStats = yield review_model_1.Review.aggregate([
        { $match: { sellerId: order.sellerId } },
        {
            $group: {
                _id: "$sellerId",
                avgRating: { $avg: "$rating" },
            },
        },
    ]);
    yield user_model_1.User.findByIdAndUpdate(order.sellerId, {
        averageRating: ((_c = sellerStats[0]) === null || _c === void 0 ? void 0 : _c.avgRating) || 0,
    });
    // ---------------------------
    return newReview;
});
const getReviewsByServiceId = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ serviceId }).populate("clientId", "name profileImage");
    return reviews;
});
// 💡 নতুন ফাংশন: সেলারের সমস্ত সার্ভিসের রিভিউ দেখা
const getReviewsBySellerId = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ sellerId })
        .populate("clientId", "name profileImage") // রিভিউ দাতা
        .populate("serviceId", "title price"); // কোন সার্ভিস
    return reviews;
});
// 💡 নতুন ফাংশন: ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা
const getMyReviews = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ clientId })
        .populate("serviceId", "title price") // কোন সার্ভিস
        .populate("sellerId", "name"); // কোন সেলারকে দেওয়া হয়েছে
    return reviews;
});
exports.ReviewServices = {
    createReview,
    getReviewsByServiceId,
    getReviewsBySellerId, // নতুন
    getMyReviews, // নতুন
};
