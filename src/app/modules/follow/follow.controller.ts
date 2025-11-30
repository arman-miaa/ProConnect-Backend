// src/modules/follow/follow.controller.ts

import { Request, Response, NextFunction } from "express";
import { FollowServices } from "./follow.service";
import { Types } from "mongoose";
// Assuming catchAsync and sendResponse utilities are available

const createFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // JWT token থেকে লগইন করা ইউজারের আইডি পাওয়া
    const followerId = req.user.userId;
    const { followingId } = req.params;
   
   

   

    // Validation check
    if (!followingId) {
      return res.status(400).json({
        success: false,
        message: "followingId is required",
      });
    }

    // Follow service call করা
    const newFollow = await FollowServices.createFollow(
      new Types.ObjectId(followerId),
      new Types.ObjectId(followingId)
    );

    res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: newFollow,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 🚀 ১. JWT token থেকে লগইন করা ইউজারের আসল আইডি পাওয়া
    // এটি আপনার createFollow ফাংশনের followerId এক্সট্র্যাকশন লজিকের সাথে সামঞ্জস্যপূর্ণ
    const followerId = (req.user )?.userId;

    // ২. প্যারামিটার থেকে যাকে আনফলো করা হবে তার ID নেওয়া
    const { followingId } = req.params;

    // Validation check
    if (!followerId || !followingId) {
      return res.status(400).json({
        success: false,
        message: "Follower ID or Following ID is missing.",
      });
    }

    // ৩. Unfollow service call করা
    const deletedFollow = await FollowServices.deleteFollow(
      new Types.ObjectId(followerId), // আসল followerId ব্যবহার করা হলো
      new Types.ObjectId(followingId)
    );

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      data: deletedFollow,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      // JWT থেকে logged-in user ID
   
    
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const result = await FollowServices.getFollowers(
      new Types.ObjectId(userId),
      limit,
      page
    );

    res.status(200).json({
      success: true,
      message: "Followers list retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};


const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const result = await FollowServices.getFollowing(
      new Types.ObjectId(userId),
      limit,
      page
    );

    res.status(200).json({
      success: true,
      message: "Following list retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};


export const FollowControllers = {
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
};
