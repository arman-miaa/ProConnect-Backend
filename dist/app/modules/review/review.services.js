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
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, clientId } = payload;
    // 1. অর্ডারটি লোড করুন
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found.");
    }
    // 2. ক্লায়েন্ট এই অর্ডারটি দিয়েছে কিনা চেক করুন
    if (order.clientId.toString() !== clientId.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to review this order.");
    }
    // 3. অর্ডার স্ট্যাটাস চেক করুন (শুধুমাত্র COMPLETED অর্ডারের রিভিউ)
    if (order.orderStatus !== "COMPLETED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Review can only be submitted for completed orders.");
    }
    // 4. ডুপ্লিকেট রিভিউ চেক (orderId unique হওয়ায় এটি মডেল লেভেলেও সুরক্ষিত)
    const existingReview = yield review_model_1.Review.findOne({ orderId });
    if (existingReview) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You have already reviewed this order.");
    }
    // 5. 🛑 CRITICAL FIX: অর্ডার থেকে serviceId এবং sellerId যোগ করে finalPayload তৈরি করা
    const finalPayload = Object.assign(Object.assign({}, payload), { serviceId: order.serviceId, sellerId: order.sellerId, clientId: clientId });
    // 6. রিভিউ তৈরি করুন
    const newReview = yield review_model_1.Review.create(finalPayload);
    // 7. ⭐️ সার্ভিস মডেলে রেটিং আপডেট করার লজিক এখানে যোগ করুন (যেমন: Service.findByIdAndUpdate(order.serviceId, ...))
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
