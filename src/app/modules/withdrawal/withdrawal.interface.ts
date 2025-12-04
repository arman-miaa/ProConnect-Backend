import { Types } from "mongoose";

export enum WithdrawalStatus {
  PENDING = "PENDING", // সেলার অনুরোধ করেছে
  APPROVED = "APPROVED", // অ্যাডমিন পেমেন্ট করেছে
  REJECTED = "REJECTED", // অপর্যাপ্ত ব্যালেন্স বা ভুল তথ্যের জন্য বাতিল
}

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  PAYPAL = "PAYPAL",
  BKASH = "BKASH", // বাংলাদেশের জন্য
  ROCKET = "ROCKET",
}

export interface IWithdrawal {
  _id?: Types.ObjectId;

  sellerId: Types.ObjectId;
  amount: number;

  method: PaymentMethod;
  accountDetails: string; // ব্যাংক অ্যাকাউন্ট/বিকাশ নাম্বার ইত্যাদি

  status: WithdrawalStatus;

  transactionId?: string; // অ্যাডমিন কর্তৃক ম্যানুয়াল পেমেন্ট রেফারেন্স

  createdAt?: Date;
  updatedAt?: Date;
}
