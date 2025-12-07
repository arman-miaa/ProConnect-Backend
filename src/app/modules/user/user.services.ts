/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";


import { envVars } from "../../config/env";
import { IUser, Role } from "./user.interface";

import { User } from "./user.model";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

const createUser = async (payload: any) => {
  const { email, password, role, ...rest } = payload;

  // check existing user
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // hash password
  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const userData: any = {
    email,
    password: hashedPassword,
    role,
    name: rest.name,
    address:rest.address || ""
  };

  // ======================================
  // 🔥 ROLE BASED FIELD LOGIC
  // ======================================

  if (role === "SELLER") {
 
    userData.title = rest.title || "";
    userData.bio = rest.bio || "";
    userData.skills = rest.skills || [];
  }

if (role === "CLIENT") {


  // Make sure CLIENT never gets skills/title/bio
  delete userData.skills;
  delete userData.title;
  delete userData.bio;
}


  const newUser = await User.create(userData);

  const userObject: any = newUser.toObject();
  delete userObject.password;

  return userObject;
};






const createAdmin = async (payload: any) => {
  const { email, password, name, profilePicture } = payload;

  const exist = await User.findOne({ email });
  if (exist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin already exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const admin = await User.create({
    email,
    password: hashedPassword,
    name,
    profilePicture,
    role: Role.ADMIN,
    address: payload.address || "",
    isVerified: true,
    is_active: "ACTIVE",
  });

  const adminObject: any = admin.toObject();
  

  delete adminObject.password;
  delete adminObject.skills; 
  delete adminObject.averageRating; 
  // delete adminObject.location; 
  delete adminObject.bio; 


  return adminObject; 
};





const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: { total: totalUsers },
  };
};


const updateUser = async (id: string, payload: Partial<IUser>) => {
  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new Error("User not found.");
  }

 


  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.profilePicture && existingUser.profilePicture) {
    await deleteImageFromCLoudinary(existingUser.profilePicture);
  }

  return updatedUser;
};





export const UserServcies = {
  createUser,
  createAdmin,
  getAllUsers,
  updateUser

};
