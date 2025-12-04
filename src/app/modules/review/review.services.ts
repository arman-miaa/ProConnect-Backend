import httpStatus from "http-status-codes";

import { Order } from "../order/order.model";
import { Review } from "./review.model";
import { IReview } from "./review.interface";
import AppError from "../../errorHelpers/AppError";

const createReview = async (payload: IReview) => {
  const { orderId, clientId } = payload;

  // 1. অর্ডারটি লোড করুন
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found.");
  }

  // 2. ক্লায়েন্ট এই অর্ডারটি দিয়েছে কিনা চেক করুন
  if (order.clientId.toString() !== clientId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to review this order."
    );
  }

  // 3. অর্ডার স্ট্যাটাস চেক করুন (শুধুমাত্র COMPLETED অর্ডারের রিভিউ)
  if (order.orderStatus !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review can only be submitted for completed orders."
    );
  }

  // 4. ডুপ্লিকেট রিভিউ চেক (orderId unique হওয়ায় এটি মডেল লেভেলেও সুরক্ষিত)
  const existingReview = await Review.findOne({ orderId });
  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this order."
    );
  }

  // 5. 🛑 CRITICAL FIX: অর্ডার থেকে serviceId এবং sellerId যোগ করে finalPayload তৈরি করা
  const finalPayload: IReview = {
    ...payload,
    serviceId: order.serviceId, 
    sellerId: order.sellerId,  
    clientId: clientId,
  };

  // 6. রিভিউ তৈরি করুন
  const newReview = await Review.create(finalPayload);

  // 7. ⭐️ সার্ভিস মডেলে রেটিং আপডেট করার লজিক এখানে যোগ করুন (যেমন: Service.findByIdAndUpdate(order.serviceId, ...))

  return newReview;
};

const getReviewsByServiceId = async (serviceId: string) => {
  const reviews = await Review.find({ serviceId }).populate(
    "clientId",
    "name profileImage"
  );
  return reviews;
};

// 💡 নতুন ফাংশন: সেলারের সমস্ত সার্ভিসের রিভিউ দেখা
const getReviewsBySellerId = async (sellerId: string) => {
    const reviews = await Review.find({ sellerId })
        .populate("clientId", "name profileImage") // রিভিউ দাতা
        .populate("serviceId", "title price"); // কোন সার্ভিস
    return reviews;
};

// 💡 নতুন ফাংশন: ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা
const getMyReviews = async (clientId: string) => {
    const reviews = await Review.find({ clientId })
        .populate("serviceId", "title price") // কোন সার্ভিস
        .populate("sellerId", "name"); // কোন সেলারকে দেওয়া হয়েছে
    return reviews;
};

export const ReviewServices = {
  createReview,
  getReviewsByServiceId,
  getReviewsBySellerId, // নতুন
  getMyReviews, // নতুন
};