/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";

import htttpStatus from "http-status-codes";

import bcryptjs from "bcryptjs";

import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { envVars } from "../../config/env";

import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");
  if (!isUserExist) {
    throw new AppError(htttpStatus.BAD_REQUEST, "User does not exist");
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(htttpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const userObject = isUserExist.toObject();

  const {
    password: pass,
    skills,
    averageRating,
    location,
    bio,
    ...rest
  } = userObject;

  const userTokens = createUserTokens(rest);

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest, // rest এ শুধু প্রয়োজনীয় ডেটা থাকবে
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(htttpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  await user!.save();
};

const getMe = async (decodedToken: JwtPayload) => {
  // এখানে আপনি JWT পেলোডটি পাচ্ছেন, টোকেন আবার ডিকোড করার দরকার নেই
 
  const userData = await User.findOne({
    email: decodedToken.email, // JWT থেকে ইমেল ব্যবহার করে ইউজার খুঁজুন
    // status: UserStatus.ACTIVE, // যদি UserStatus.ACTIVE আপনার ইউজার মডেলে না থাকে তবে এটি সরিয়ে দিন
  }).select("-password"); // পাসওয়ার্ড বাদ দিয়ে বাকি সব ডেটা আনুন

  if (!userData) {
    throw new AppError(htttpStatus.NOT_FOUND, "User not found or is inactive.");
  }

  // ✅ গুরুত্বপূর্ণ: toObject() ব্যবহার করে Mongoose ডকুমেন্টকে প্লেন JS অবজেক্টে রূপান্তর করুন
  const userObject = userData.toObject();

  // আপনার login লজিকের মতো অপ্রয়োজনীয় ফিল্ডগুলো সরিয়ে দিন
  const {
    skills,
    averageRating,
    location,
    bio,
    // ... আপনার ইউজার মডেলে থাকা অন্যান্য সাব-ডকুমেন্ট
    ...rest
  } = userObject;

  // ফ্রন্টএন্ডের সুবিধার জন্য পুরো ইউজার অবজেক্টটি রিটার্ন করুন
  return rest;
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  getMe,
};
