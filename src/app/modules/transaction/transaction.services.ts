/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/transaction/transaction.service.ts

import { Transaction, TransactionDocument } from "./transaction.model";
import { TransactionType, TransactionStatus } from "./transaction.interface";
import { IOrder, OrderStatus } from "../order/order.interface"; // 💡 আপনার Order Interface

import { Types } from "mongoose";
import { Order } from "../order/order.model"; // 💡 আপনার Order Model

// 💸 ১. সফল অর্ডার থেকে সেলারকে টাকা দেওয়া (Called from Order Service: completeOrder)
const creditSeller = async (order: IOrder): Promise<void> => {
  if (order.isPaid === false) return;

  // 1. সেলার সেটেলমেন্ট রেকর্ড
  await Transaction.create({
    relatedOrder: order._id,
    userId: order.sellerId,
    type: TransactionType.SETTLEMENT,
    status: TransactionStatus.SUCCESS,
    amount: order.netAmount,
    description: `Order settlement (${order._id}). Net amount credited to seller.`,
  });

  // 2. প্ল্যাটফর্ম ফি রেকর্ড
  await Transaction.create({
    relatedOrder: order._id,
    userId: order.sellerId, // সেলারের পক্ষ থেকে ফি কাটা হয়েছে ধরে নেওয়া হচ্ছে
    type: TransactionType.FEE,
    status: TransactionStatus.SUCCESS,
    amount: -order.platformFee, // নেগেটিভ অ্যামাউন্ট দিয়ে ফি রেকর্ড করা (ঐচ্ছিক)
    description: `Platform commission deducted for order ${order._id}.`,
  });

  // 3. 💡 (এখানে WalletService.credit() কল হবে)
};

// 💰 ২. বাতিল অর্ডারের জন্য রিফান্ড প্রসেস করা (Called from Order Service: cancelOrder)
const processRefund = async (order: IOrder): Promise<any> => {
  if (!order.isPaid) {
    return { success: true, message: "Order was not paid. No refund needed." };
  }

  // 1. রিফান্ড গেটওয়ে কল
  // 💡 await PaymentGateway.initiateRefund(order.paymentIntentId, order.totalPrice);

  // 2. অর্ডারের স্ট্যাটাস REFUNDED করা
  const orderUpdateResult = await Order.findByIdAndUpdate(
    order._id,
    { orderStatus: OrderStatus.REFUNDED },
    { new: true }
  ).lean();

  // 3. লেনদেন রেকর্ড
  await Transaction.create({
    relatedOrder: order._id,
    userId: order.clientId,
    type: TransactionType.REFUND,
    status: TransactionStatus.SUCCESS,
    amount: order.totalPrice,
    description: `Refund processed for cancelled order ${order._id}.`,
  });

  return orderUpdateResult;
};

// 💵 ৩. সেলারের টাকা উত্তোলনের অনুরোধ (Seller Initiated)
const createWithdrawal = async (
  sellerId: Types.ObjectId,
  amount: number
): Promise<TransactionDocument> => {
  // 1. ওয়ালেট ব্যালেন্স চেক (WalletService.getBalance() কল হবে)

  // 2. টাকা উত্তোলনের ট্রানজাকশন তৈরি
  const withdrawal = await Transaction.create({
    userId: sellerId,
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PENDING,
    amount: amount,
    description: `Withdrawal request initiated by seller.`,
  });

  return withdrawal;
};

// 📜 ৪. ট্রানজাকশন হিস্টরি আনা
const getMyTransactions = async (
  userId: Types.ObjectId,
  query: Record<string, any>
) => {
  const transactions = await Transaction.find({ userId: userId, ...query })
    .sort("-createdAt")
    .lean();

  return transactions;
};

const getAllTransactions = async (query: Record<string, any>) => {
  // 🚫 কোনো userId ফিল্টার নেই
  const result = await Transaction.find({})
    .sort(query.sortBy || "-createdAt")
    .limit(query.limit || 10)
    .skip(query.page * query.limit || 0)
    .lean();

  return result;
};



const recordInitialPayment = async (order: IOrder) => {
  // Create initial transaction record with INITIATED status
  await Transaction.create({
    relatedOrder: order._id,
    // user.userId এর পরিবর্তে সরাসরি order.clientId ব্যবহার করা ভালো,
    // কারণ ক্লায়েন্টই পেমেন্ট করছে।
    userId: order.clientId, // 👈 FIX: userId যোগ করা হয়েছে

    // 💡 FIX: আপনার TransactionType enum এর সঠিক মান ব্যবহার করুন।
    // যদি আপনার enum এ 'DEPOSIT' বা 'INITIAL' থাকে, তবে সেটি ব্যবহার করুন।
    type: TransactionType.DEPOSIT, // 👈 FIX: type এ সঠিক Enum ভ্যালু দিন

    status: TransactionStatus.INITIATED, // বা আপনার এনামের সঠিক মান
    amount: order.totalPrice,

    description: `Initial payment initiated for order ${String(
      order._id || ""
    )}`,
  });
};

const updateStatus = async (
  orderId: string,
  status: "SUCCESS" | "FAILED",
  validationData?: any
) => {
  const updated = await Transaction.findOneAndUpdate(
    { orderId },
    {
      status,
      paymentGatewayData: validationData,
      updatedAt: new Date(),
    },
    { new: true }
  );
  return updated;
};



export const TransactionServices = {
  creditSeller,
  processRefund,
  createWithdrawal,
  getMyTransactions,
  getAllTransactions,
  recordInitialPayment,
  updateStatus,
};
