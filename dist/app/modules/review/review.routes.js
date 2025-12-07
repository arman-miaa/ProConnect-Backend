"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = express_1.default.Router();
// 1. 📝 নতুন রিভিউ তৈরি (ক্লায়েন্ট)
router.post('/', (0, checkAuth_1.checkAuth)(user_interface_1.Role.CLIENT), review_controller_1.ReviewControllers.createReview);
router.get("/admin/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), // অথবা Role.SUPER_ADMIN যোগ করতে পারো
review_controller_1.ReviewControllers.getAllReviews // নতুন controller তৈরি করতে হবে
);
// 2. 🔍 নির্দিষ্ট সার্ভিসের রিভিউ দেখা (ভিজিটর/সেলার)
// Rote: GET /reviews/service/:serviceId
router.get('/service/:serviceId', review_controller_1.ReviewControllers.getReviewsByServiceId);
// 3. 💼 সেলারের সমস্ত সার্ভিসের রিভিউ দেখা (ভিজিটর/সেলার)
// Rote: GET /reviews/seller/:sellerId
router.get("/seller/:sellerId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), review_controller_1.ReviewControllers.getReviewsBySellerId);
// 4. 👤 ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা (ক্লায়েন্ট)
// Rote: GET /reviews/my-reviews
router.get('/my-reviews', (0, checkAuth_1.checkAuth)(user_interface_1.Role.CLIENT), review_controller_1.ReviewControllers.getMyReviews);
exports.ReviewRoutes = router;
