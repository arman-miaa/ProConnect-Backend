import {  Types } from "mongoose";

// Role এনুম (Enum) নির্ধারণ
export enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN="SUPER_ADMIN",
  CLIENT = "CLIENT",
  SELLER = "SELLER",
}

export enum IsActiv {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  // MongoDB ObjectId স্ট্রং টাইপিংয়ের জন্য
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password?: string; // পাসওয়ার্ড ইনপুট করার সময় প্রয়োজন, কিন্তু ডেটাবেস থেকে আনার সময় নয়
  role: Role;

  // সেলার/অ্যাডমিন-এর জন্য
  isVerified: boolean;
  is_active: IsActiv;

  // প্রোফাইল ডিটেইলস
  location?: string;
  bio?: string;
  skills?: string[];
  profilePicture?: string;
  averageRating?: number;

  // স্বয়ংক্রিয় ডেটা
  createdAt?: Date;
  updatedAt?: Date;
}
