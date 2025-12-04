// src/app/modules/transaction/transaction.controller.ts

import { Request, Response } from "express";

import httpStatus from "http-status-codes";

import { Types } from "mongoose";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.services";

// 💵 ১. সেলারের টাকা উত্তোলনের অনুরোধ
const createWithdrawal = catchAsync(async (req: Request, res: Response) => {
  // userId হলো সেলারের ID
  const sellerId = req.user?.userId;
  const { amount } = req.body;

  const result = await TransactionServices.createWithdrawal(
    new Types.ObjectId(sellerId),
    amount
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdrawal request initiated successfully.",
    data: result,
  });
});

// 📜 ২. ট্রানজাকশন হিস্টরি দেখা (সেলার/ক্লায়েন্ট)
const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const result = await TransactionServices.getMyTransactions(
    new Types.ObjectId(userId),
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction history retrieved successfully.",
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  // কোনো userId চেক করার দরকার নেই, শুধু Authorization চেক করা হয়েছে
  const result = await TransactionServices.getAllTransactions(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All platform transactions retrieved successfully.",
    data: result,
  });
});

export const TransactionControllers = {
  createWithdrawal,
  getMyTransactions,
  getAllTransactions
};
