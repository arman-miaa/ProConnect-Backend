"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const env_1 = require("../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuporAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuporAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin...");
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Super Admin",
            role: user_interface_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            is_active: user_interface_1.IsActiv.ACTIVE,
        };
        const superAdmin = yield user_model_1.User.create(payload);
        // ✅ কনসোল আউটপুটের জন্য ডেটা পরিষ্কার করা
        const result = superAdmin.toObject();
        delete result.password;
        delete result.skills;
        delete result.averageRating;
        //  delete result.location; 
        delete result.bio;
        console.log("Super Admin Created Successfully! \n");
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
