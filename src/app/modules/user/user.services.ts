/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";


import { envVars } from "../../config/env";
import { Role } from "./user.interface";

import { User } from "./user.model";

const createUser = async (payload: any) => {
  const { email, password,  role, ...rest } = payload;

  // check existing user
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // hash password
  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  // create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    
    name: rest.name,
  
    picture: rest.picture,
  });


  const result = {
    ...user.toObject(),
    
  };
  return result;
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
    isVerified: true,
    is_active: "ACTIVE", 
  });

  const adminObject: any = admin.toObject();
  

  delete adminObject.password;
  delete adminObject.skills; 
  delete adminObject.averageRating; 
  delete adminObject.location; 
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
const updateUser = async () => {

  return {
   
  };
};

export const UserServcies = {
  createUser,
  createAdmin,
  getAllUsers,
  updateUser

};
