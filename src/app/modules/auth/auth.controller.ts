/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => { 
const loginInfo = await AuthServices.credentialsLogin(req.body);

    // res.cookie("accessToken",loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false,
    // });

  

    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false,
    // });

      setAuthCookie(res, loginInfo);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged In successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => { 
    const refreshToken = req.cookies.refreshToken 
    if (!refreshToken) {
     throw new AppError(httpStatus.BAD_REQUEST,"Refresh Token is missing");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    
        // res.cookie("accessToken", tokenInfo.accessToken, {
        //   httpOnly: true,
        //   secure: false,
    // });
    setAuthCookie(res,tokenInfo)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrived successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

  // res.clearCookie("accessToken", {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  // });
  // res.clearCookie("refreshToken", {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  // });
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });


    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged out successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

   await AuthServices.resetPassword(oldPassword, newPassword,decodedToken)
  
sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password chenged successfully",
      data: null,
    });
  }
);


export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
