import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;

  orderId: Types.ObjectId;
  serviceId: Types.ObjectId;
  reviewerId: Types.ObjectId; // ক্লায়েন্ট
  sellerId: Types.ObjectId;

  rating: number; // 1 to 5
  comment: string;

  createdAt?: Date;
  updatedAt?: Date;
}
