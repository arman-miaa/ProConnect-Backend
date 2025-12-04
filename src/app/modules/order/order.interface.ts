import { Types } from "mongoose";

// অর্ডারের অবস্থা
export enum OrderStatus {
  PENDING = "PENDING", // ক্লায়েন্ট টাকা দিয়েছে, সেলার এখনো দেখেনি/গ্রহণ করেনি
  ACCEPTED = "ACCEPTED", // সেলার কাজ শুরু করেছে
  COMPLETED = "COMPLETED", // সেলার কাজ ডেলিভারি করেছে, ক্লায়েন্ট গ্রহণ করেছে
  CANCELLED = "CANCELLED", // বাতিল (ক্লায়েন্ট বা সেলার কর্তৃক)
  DISPUTED = "DISPUTED", // বিরোধ চলছে
  REFUNDED = "REFUNDED", // সম্পূর্ণ টাকা ফেরত দেওয়া হয়েছে
}

export interface IOrder {
  _id?: Types.ObjectId;

  serviceId: Types.ObjectId;
  buyerId: Types.ObjectId; // ক্লায়েন্ট
  sellerId: Types.ObjectId; // সেলার

  // আর্থিক বিবরণ
  totalPrice: number;
  platformFee: number;
  sellerEarnings: number;

  // পেমেন্ট রেফারেন্স
  paymentIntentId: string;

  status: OrderStatus;

  cancellationReason?: string;
  deliveryDate?: Date; // সেলার কবে ডেলিভারি দিল

  createdAt?: Date;
  updatedAt?: Date;
}
