"use strict";
// src/app/modules/review/review.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    serviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
        required: false,
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    // Review শুধুমাত্র COMPLETED অর্ডারের জন্যই দেওয়া যাবে, তাই orderId প্রয়োজন
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true, // একটি অর্ডারের জন্য একবারই রিভিউ দেওয়া যাবে
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Mongoose-এ একটি সার্ভিস-এর রিভিউ এভারেজ রেটিং আপডেট করার জন্য স্ট্যাটিক বা ইনস্ট্যান্স মেথড যোগ করতে পারেন।
exports.Review = (0, mongoose_1.model)("Review", ReviewSchema);
