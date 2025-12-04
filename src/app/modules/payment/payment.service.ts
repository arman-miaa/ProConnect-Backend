/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/payment/payment.service.ts

import { SSLService } from "../ssl/ssl.service";
import { OrderStatus, IOrder } from "../order/order.interface";
import { IPaymentUpdatePayload } from "../ssl/ssl.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { TransactionServices } from "../transaction/transaction.services";
import { OrderServices } from "../order/order.services";
import { GenericService } from "../order/base.service";
import { Order } from "../order/order.model";

// 1. পেমেন্ট ইনিশিয়েট করা
const initPayment = async (bookingId: string, user: any) => {
  // <CHANGE> Pass the Model and cast the result to IOrder
  const order = (await GenericService.getSingle(
    Order,
    bookingId
  )) as IOrder | null;

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found.");
  }
  if (order.orderStatus !== OrderStatus.PENDING || order.isPaid) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order is not ready for payment."
    );
  }

  // 💡 FIX: user.name এবং user.email চেক করার জন্য নিরাপদ ডিফল্ট ব্যবহার
  const paymentPayload = {
    amount: order.totalPrice,
    transactionId: order._id?.toString() || "",

    name: user.name || "Client User", // ডিফল্ট বা সেইফগার্ড
    email: user.email || "client@example.com", // ডিফল্ট বা সেইফগার্ড
    address: user.address || "Address",
    phoneNumber: user.phoneNumber || "01XXXXXXXXX",
  };

  // <CHANGE> You need to add this method to TransactionServices
  await TransactionServices.recordInitialPayment(order);

  const sslResponse = await SSLService.sslPaymentInit(paymentPayload);
  return sslResponse;
};

// 2. SSLCommerz ওয়েবুক হ্যান্ডেল করা (Success/Fail/Cancel/Validate)
const handlePaymentStatusUpdate = async (payload: IPaymentUpdatePayload) => {
  const orderId = payload.transactionId;

  // 💡 FIX: payload.status "success" অথবা "validate" হলে তা সফল হিসেবে গণ্য হবে।
  // SSLCommerz "Success" রুট থেকে আসলেও val_id না থাকতে পারে।
  const isSuccessCall =
    payload.status === "success" || payload.status === "validate";

  let isValidated = false;
  let validationData = null;

  // 💡 ভ্যালিডেশন আবশ্যক (IPN/Success রুট থেকে val_id পাওয়া গেলে)
  if (payload.val_id) {
    const validationResult = await SSLService.validatePayment({
      val_id: payload.val_id,
      tran_id: orderId,
    });
    isValidated = validationResult.isValid;
    validationData = validationResult.validationData;
  }

  // 💡 চূড়ান্ত স্ট্যাটাস নির্ধারণ:
  // হয় val_id ছাড়া success কল (যদি ভ্যালিডেশন ট্রিগার না হয়), অথবা val_id সহ সফল ভ্যালিডেশন
  const isPaymentFinalSuccess =
    isSuccessCall && (payload.val_id ? isValidated : true);

  if (isPaymentFinalSuccess) {
    // ✅ SUCCESS: অর্ডার ও ট্রানজাকশন আপডেট
    await OrderServices.updatePaymentStatus(orderId, true);
    await TransactionServices.updateStatus(orderId, "SUCCESS", validationData);
    return { success: true, message: "Payment successful and validated." };
  } else {
    // ❌ FAILED/CANCELLED: ট্রানজাকশন আপডেট এবং অর্ডার বাতিল
    await OrderServices.updatePaymentStatus(orderId, false);
    await TransactionServices.updateStatus(orderId, "FAILED", validationData);

    // পেমেন্ট ব্যর্থ হওয়ায় অর্ডারটি CANCELLED করে দেওয়া
    // 💡 FIX: cancelOrder এ user এবং role হিসেবে 'null' পাস করা হলো।
    // order.service.ts এর cancelOrder ফাংশনটি এখন এই 'null' মানটি দেখে সিস্টেম কল হিসেবে গণ্য করবে।
    await OrderServices.cancelOrder(orderId, null, null, {
      cancellationReason: `Payment ${payload.status} by gateway or user.`,
    });

    return {
      success: false,
      message: "Payment failed or could not be validated.",
    };
  }
};

export const PaymentService = {
  initPayment,
  handlePaymentStatusUpdate,
};
