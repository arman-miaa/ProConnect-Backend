// src/modules/follow/follow.service.ts

import { Types } from "mongoose";
import { FollowModel } from "./follow.model";
import { UserModel } from "../user/user.model"; // UserModel ইমপোর্ট করা হয়েছে

// ধরে নিলাম আপনার AppError এবং httpStatus ক্লাস এখানে ব্যবহার করা হবে
// import AppError from '../../errors/AppError';
// import httpStatus from 'http-status';

export const createFollow = async (
  followerId: Types.ObjectId,
  followingId: Types.ObjectId
) => {
  // 1️⃣ নিজেকে ফলো করা আটকানো
  if (followerId.equals(followingId)) {
    throw new Error("You cannot follow yourself.");
  }

  // 2️⃣ আগে থেকেই ফলো করা আছে কিনা চেক করা (duplicate insert আটকাতে extra safety)
  const alreadyFollowed = await FollowModel.findOne({
    follower_id: followerId,
    following_id: followingId,
  });

  if (alreadyFollowed) {
    throw new Error("You are already following this user.");
  }

  // 3️⃣ ফলো তৈরি করা
  const newFollow = await FollowModel.create({
    follower_id: followerId,
    following_id: followingId,
  });

  // 4️⃣ দুইটা কাউন্ট একসাথে আপডেট করা (parallel way)
  await Promise.all([
    UserModel.findByIdAndUpdate(followerId, {
      $inc: { following_count: 1 },
    }),
    UserModel.findByIdAndUpdate(followingId, {
      $inc: { followers_count: 1 },
    }),
  ]);

  return newFollow;
};

const deleteFollow = async (
  followerId: Types.ObjectId,
  followingId: Types.ObjectId
) => {
  // 1. ফলো রিলেশন ডিলিট করা
  const result = await FollowModel.findOneAndDelete({
    follower_id: followerId,
    following_id: followingId,
  });

  if (!result) {
    // throw new AppError(httpStatus.NOT_FOUND, "You are not following this user.");
    throw new Error("You are not following this user.");
  }

  // 2. User মডেলের কাউন্ট আপডেট করা (Atomic Update)
  await UserModel.findByIdAndUpdate(followerId, {
    $inc: { following_count: -1 },
  });
  await UserModel.findByIdAndUpdate(followingId, {
    $inc: { followers_count: -1 },
  });

  return result;
};

const getFollowers = async (userId: Types.ObjectId, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;

  const followers = await FollowModel.find({ following_id: userId })
    .populate("follower_id", "full_name picture email role")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .lean();

  const total = await FollowModel.countDocuments({ following_id: userId });

  return {
    meta: { total, page, limit },
    data: followers,
  };
};


const getFollowing = async (
  userId: Types.ObjectId,
  limit = 10,
  page = 1
) => {
  const skip = (page - 1) * limit;

  const following = await FollowModel.find({ follower_id: userId }) // যারা ফলো করছে
    .populate("following_id", "full_name picture email role") // যাদের ফলো করা হচ্ছে তাদের ডেটা পপুলেট করা
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .lean();

  const total = await FollowModel.countDocuments({ follower_id: userId });

  return {
    meta: { total, page, limit },
    data: following,
  };
};

export const FollowServices = {
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
};
