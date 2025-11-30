/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActiv, IUser } from "../user/user.interface"
import htttpStatus from "http-status-codes";
import { UserModel } from "../user/user.model";
import bcryptjs from "bcryptjs";


import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { generateToken, verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist =  await UserModel.findOne({ email });
    if (!isUserExist) {
        throw new AppError(htttpStatus.BAD_REQUEST,"User does not exist");
    }
    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
    
    if (!isPasswordMatched) {
        throw new AppError(htttpStatus.UNAUTHORIZED,"Password is incorrect");
    } 
    
const userTokens = createUserTokens(isUserExist);

    const { password:pass, ...rest } = isUserExist.toObject();

    return {
       
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user:rest
}
}

const getNewAccessToken = async (refreshToken: string) => {
    
const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {       
        accessToken:newAccessToken
}
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await UserModel.findById(decodedToken.userId);     
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
    
    if (!isOldPasswordMatch) {
      throw new AppError(htttpStatus.UNAUTHORIZED, "Old Password is incorrect");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
   await user!.save();  

}




export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    }