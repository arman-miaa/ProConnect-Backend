import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewServices } from "./review.services";

const createReview = catchAsync(async (req: Request, res: Response) => {
  // টোকেন থেকে clientId যোগ করা হলো
  const payload = { ...req.body, clientId: req.user?.userId };
  const result = await ReviewServices.createReview(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review submitted successfully!",
    data: result,
  });
});

const getReviewsByServiceId = catchAsync(
  async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const result = await ReviewServices.getReviewsByServiceId(serviceId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully.",
      data: result,
    });
  }
);

// 💡 নতুন ফাংশন: সেলারের সমস্ত সার্ভিসের রিভিউ দেখা
const getReviewsBySellerId = catchAsync(async (req: Request, res: Response) => {
  const { sellerId } = req.params;
  const result = await ReviewServices.getReviewsBySellerId(sellerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller's reviews retrieved successfully.",
    data: result,
  });
});

// 💡 নতুন ফাংশন: ক্লায়েন্টের দেওয়া নিজস্ব রিভিউ দেখা
const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  // টোকেন থেকে clientId নেওয়া
  const clientId = req.user?.userId as string;
  const result = await ReviewServices.getMyReviews(clientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your submitted reviews retrieved successfully.",
    data: result,
  });
});



export const ReviewControllers = {
  createReview,
  getReviewsByServiceId,
  getReviewsBySellerId, // নতুন
  getMyReviews, // নতুন
};
