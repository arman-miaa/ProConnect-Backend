import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    totalPrice: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    sellerEarnings: { type: Number, required: true },

    paymentIntentId: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    cancellationReason: { type: String },
    deliveryDate: { type: Date },
  },
  { timestamps: true }
);

// দ্রুত সেলার/ক্লায়েন্ট অর্ডার খোঁজার জন্য ইনডেক্সিং
orderSchema.index({ sellerId: 1, status: 1 });
orderSchema.index({ buyerId: 1, status: 1 });

export const Order = model<IOrder>("Order", orderSchema);
