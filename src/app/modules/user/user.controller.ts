/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServcies } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServcies.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);
const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await UserServcies.createAdmin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // req.user এ থাকা decoded user info পাস করা হলো
    const userId = req.user.userId;
    const decodedToken = req.user; // checkAuth মিডলওয়্যার থেকে আসা তথ্য
    const updateData = req.body;
// console.log("user id",userId, "token",decodedToken,"updateData",updateData);
    const result = await UserServcies.updateUser(
      userId,
      updateData,
      decodedToken
    ); // ✅ decodedToken পাস করা হলো

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  }
);


// =================== Admin Updating Other Users ===================
const adminUpdateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const decodedToken = req.user; // Admin token info
  const updateData = req.body;

  const result = await UserServcies.updateUser(userId, updateData, decodedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully by admin",
    data: result,
  });
});

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServcies.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All users Retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  createAdmin,
  updateUser,
  adminUpdateUser,
  getAllUsers,
};
