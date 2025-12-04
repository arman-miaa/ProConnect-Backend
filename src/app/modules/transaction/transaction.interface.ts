import { Types } from "mongoose";

export enum TransactionType {
  DEPOSIT = "DEPOSIT", // ক্লায়েন্ট কর্তৃক পেমেন্ট
  FEE = "FEE", // প্ল্যাটফর্ম ফি
  WITHDRAWAL = "WITHDRAWAL", // সেলারের উত্তোলন
  REFUND = "REFUND", // ক্লায়েন্টকে ফেরত
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
  INITIATED = "INITIATED",
}

export interface ITransaction {
  _id?: Types.ObjectId;

  userId: Types.ObjectId; // যিনি লেনদেন করেছেন (ক্লায়েন্ট বা সেলার)

  type: TransactionType;
  status: TransactionStatus;

  amount: number;

  relatedOrder?: Types.ObjectId; // যদি অর্ডার সম্পর্কিত হয়
  paymentIntentId?: string; // পেমেন্ট গেটওয়ে রেফারেন্স

  description: string;

  createdAt?: Date;
}
