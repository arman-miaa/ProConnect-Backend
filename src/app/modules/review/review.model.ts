import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    }, // এক অর্ডারের জন্য একটিই রিভিউ
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, minlength: 10 },
  },
  { timestamps: true }
);

// রিভিউ দেওয়ার আগে অর্ডারটি COMPLETED কিনা তা চেক করার জন্য ইনডেক্স
reviewSchema.index({ orderId: 1, reviewerId: 1 }, { unique: true });
reviewSchema.index({ serviceId: 1 }); // দ্রুত সার্ভিসের রিভিউ খোঁজা

export const Review = model<IReview>("Review", reviewSchema);
