

import express from "express";



import { ReviewControllers } from "./review.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

// 1. 📝 নতুন রিভিউ তৈরি (ক্লায়েন্ট)
// Rote: POST /reviews/
router.post(
  '/',
  checkAuth(Role.CLIENT), 
  // validateZodRequest(ReviewValidations.createReviewValidationSchema), // 💡 ভ্যালিডেশন যুক্ত করুন
  ReviewControllers.createReview
);

// 2. 🔍 নির্দিষ্ট সার্ভিসের রিভিউ দেখা (ভিজিটর/সেলার)
// Rote: GET /reviews/service/:serviceId
router.get(
  '/service/:serviceId',
  ReviewControllers.getReviewsByServiceId
);

// 3. 💼 সেলারের সমস্ত সার্ভিসের রিভিউ দেখা (ভিজিটর/সেলার)
// Rote: GET /reviews/seller/:sellerId
router.get(
  '/seller/:sellerId',
  // checkAuth() দরকার নেই, পাবলিক রুট
  ReviewControllers.getReviewsBySellerId 
);

// 4. 👤 ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা (ক্লায়েন্ট)
// Rote: GET /reviews/my-reviews
router.get(
  '/my-reviews',
  checkAuth(Role.CLIENT), // 💡 টোকেন আবশ্যিক
  ReviewControllers.getMyReviews 
);


export const ReviewRoutes = router;
