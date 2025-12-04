import { Schema, model } from "mongoose";
import {
  IWithdrawal,
  PaymentMethod,
  WithdrawalStatus,
} from "./withdrawal.interface";

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 10 }, // সর্বনিম্ন উত্তোলনের সীমা

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    accountDetails: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
    },

    transactionId: { type: String },
  },
  { timestamps: true }
);

export const Withdrawal = model<IWithdrawal>("Withdrawal", withdrawalSchema);
