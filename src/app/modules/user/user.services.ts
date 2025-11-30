/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import {UserModel} from "./user.model";
import { createProfileByRole } from "../../helpers/profileCreator";
import { envVars } from "../../config/env";
import { Role } from "./user.interface";
import { updateProfileByRole } from "../../helpers/profileUpdater";

const createUser = async (payload: any) => {
  const { email, password, phone, role, ...rest } = payload;

  // check existing user
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // hash password
  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  // create user
  const user = await UserModel.create({
    email,
    password: hashedPassword,
    role,
    phone,
    full_name: rest.full_name,
    organization_name: rest.organization_name,
    picture: rest.picture,
  });

  // create profile by role
  const profile = await createProfileByRole(role, user?._id.toString(), rest);

  // assign profile_ref_id
  if (profile) {
    user.profile_ref_id = profile._id as any;
    await user.save();
  }

  const result = {
    ...user.toObject(),
    profile: profile ? profile.toObject() : null,
  };
  return result;
};



const createAdmin = async (payload: any) => {
  const { email, password, name, photo } = payload;

  const exist = await UserModel.findOne({ email });
  if (exist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin already exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const admin = await UserModel.create({
    email,
    password: hashedPassword,
    full_name: name,
    picture: photo,
    role: Role.ADMIN,

    is_otp_verified: true,
    is_normal_verified: true,
    is_green_verified: true,
  });

  // ✅ ডেটা প্রসেসিং: অপ্রয়োজনীয় ফিল্ড বাদ দেওয়া
  const result:any = admin.toObject();

  // Verification Statuses বাদ দেওয়া
  delete result.is_otp_verified;
  delete result.is_normal_verified;
  delete result.is_green_verified;

  // Follower Counts বাদ দেওয়া
  delete result.followers_count;
  delete result.following_count;
  delete result.password; // পাসওয়ার্ডও বাদ দেওয়া উচিত

  return result; // এখন পরিষ্কার ডেটা রিটার্ন হবে
};

const updateUser = async (userId: string, payload: any, decodedToken: any) => {
  // 1️⃣ User আছে কি না চেক
  const ifUserExist = await UserModel.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // 2️⃣ নিজের প্রোফাইল ছাড়া অন্য কারো আপডেটের চেষ্টা
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    if (userId.toString() !== decodedToken.userId.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update this profile."
      );
    }
  }

  // 3️⃣ Role পরিবর্তন চেষ্টা
  if (payload.role && payload.role !== ifUserExist.role) {
    // শুধুমাত্র Admin / Super Admin পারবে
    if (
      decodedToken.role !== Role.ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change the role."
      );
    }

    // Super Admin কে শুধুমাত্র Super Admin পরিবর্তন করতে পারবে
    if (
      ifUserExist.role === Role.SUPER_ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only a Super Admin can modify another Super Admin."
      );
    }
  }

  // 4️⃣ ইমেইল আপডেট নিষিদ্ধ
  if (payload.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email cannot be updated.");
  }

  // 5️⃣ Verification এবং Active ফিল্ড পারমিশন
  const adminOnlyFields = [
    "is_normal_verified",
    "is_green_verified",
    "is_active",
  ];

  // OTP verification কেবল সিস্টেমের মাধ্যমে হবে
  if ("is_otp_verified" in payload) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to manually update OTP verification status."
    );
  }

  // Admin-only ফিল্ডগুলো শুধুমাত্র Admin / Super Admin আপডেট করতে পারবে
  for (const field of adminOnlyFields) {
    if (field in payload) {
      if (
        decodedToken.role !== Role.ADMIN &&
        decodedToken.role !== Role.SUPER_ADMIN
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `You are not authorized to update ${field}.`
        );
      }
    }
  }

  // 6️⃣ ডেটা প্রসেসিং (UserModel এবং Profile Model আলাদা করা)
  const commonUpdateData: any = {};
  const profileUpdateData: any = {};
  const keys = Object.keys(payload);

  for (const key of keys) {
    if (key === "password" && payload[key]) {
      // পাসওয়ার্ড হ্যাশ করা
      commonUpdateData.password = await bcryptjs.hash(
        payload[key] as string,
        Number(envVars.BCRYPT_SALT_ROUND)
      );
    } else if (key in UserModel.schema.paths) {
      // UserModel এ থাকা কমন ফিল্ড
      commonUpdateData[key] = payload[key];
    } else {
      // Profile Model এ থাকা ফিল্ড
      profileUpdateData[key] = payload[key];
    }
  }

  // 7️⃣ User Model আপডেট
  let updatedUser;
  if (Object.keys(commonUpdateData).length > 0) {
    updatedUser = await UserModel.findByIdAndUpdate(userId, commonUpdateData, {
      new: true,
      runValidators: true,
    });
  } else {
    updatedUser = ifUserExist;
  }

  // Null check
  if (!updatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve user data after update."
    );
  }

  // 8️⃣ Profile Model আপডেট
  let updatedProfile = null;
  const existingRole = updatedUser.role as Role;
  const profileRefId = updatedUser.profile_ref_id as string | undefined;

  if (profileRefId && Object.keys(profileUpdateData).length > 0) {
    updatedProfile = await updateProfileByRole(
      existingRole,
      profileRefId,
      profileUpdateData
    );
  }

  // 9️⃣ ফাইনাল রেজাল্ট
  const result = {
    ...updatedUser.toObject(),
    profile: updatedProfile ? updatedProfile.toObject() : null,
  };

  return result;
};



const getAllUsers = async () => {
  const users = await UserModel.find({});
  const totalUsers = await UserModel.countDocuments();

  return {
    data: users,
    meta: { total: totalUsers },
  };
};

export const UserServcies = {
  createUser,
  createAdmin,
  getAllUsers,
  updateUser,
};
