// src/models/User.model.js

import mongoose from "mongoose";
import { IsActiv, Role } from "./user.interface";





const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // নিরাপত্তার জন্য
      select: false, // পাসওয়ার্ড ডিফল্টভাবে কোয়েরিতে আসবে না
    },
    role: {
      type: String,
      enum: Role,
      default: "CLIENT",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: String,
      enum: Object.values(IsActiv), // IsActiv Enum থেকে ভ্যালু নেওয়া হলো
      default: IsActiv.ACTIVE, // ডিফল্টভাবে ACTIVE সেট করা হলো
      required: true,
    },
    // সেলারের জন্য অতিরিক্ত ফিল্ড
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String], // Array of Strings
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt যোগ করবে
  }
);

// ভবিষ্যতে পাসওয়ার্ড হ্যাশিং (Hashing) এখানে যুক্ত করা হবে

export const User = mongoose.model("User", userSchema);


