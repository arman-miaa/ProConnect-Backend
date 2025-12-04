/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServcies } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";

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
    const id = req.user.userId 
 
    // console.log(id,"id",req.body);
   const payload: IUser = {
     ...req.body,
     profilePicture: req.file?.path,
   };
   const result = await UserServcies.updateUser(id, payload);
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

  // const result = await UserServcies.updateUser(userId, updateData, decodedToken);
const result = {};
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
