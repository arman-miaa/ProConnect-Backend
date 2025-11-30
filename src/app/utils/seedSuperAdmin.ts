/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { envVars } from "../config/env"
import { IAuthProvider, Role } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model"
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => { 
    try {
      const isSuporAdminExist = await UserModel.findOne({
        email: envVars.SUPER_ADMIN_EMAIL,
      });
      if (isSuporAdminExist) {
        console.log("Super Admin Already Exists!");
        return;
      }

      console.log("Trying to create Super Admin...");

      const hashedPassword = await bcryptjs.hash(
        envVars.SUPER_ADMIN_PASSWORD,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: envVars.SUPER_ADMIN_EMAIL,
      };

      const payload = {
        full_name: "Super Admin",
        role: Role.SUPER_ADMIN,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        picture:
         
          "https://default.com/admin_pic.jpg",
        is_otp_verified: true,
        is_normal_verified: true,
        is_green_verified: true,
        auths: [authProvider],
      };

      const superAdmin = await UserModel.create(payload);
      // ✅ কনসোল আউটপুটের জন্য ডেটা পরিষ্কার করা
      const result: any = superAdmin.toObject();

      // Verification Statuses, Follower Counts এবং Password বাদ দেওয়া
      delete result.is_otp_verified;
      delete result.is_normal_verified;
      delete result.is_green_verified;
      delete result.followers_count;
      delete result.following_count;
      delete result.password;

      console.log("Super Admin Created Successfully! \n");
      console.log(result);
    } catch (error) {
        console.log(error);
    }
}