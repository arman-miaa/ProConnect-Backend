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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServcies = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = payload, rest = __rest(payload, ["email", "password", "role"]);
    // check existing user
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    // hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const userData = {
        email,
        password: hashedPassword,
        role,
        name: rest.name,
    };
    // ======================================
    // 🔥 ROLE BASED FIELD LOGIC
    // ======================================
    if (role === "SELLER") {
        userData.address = rest.address || "";
        userData.title = rest.title || "";
        userData.bio = rest.bio || "";
        userData.skills = rest.skills || [];
    }
    if (role === "CLIENT") {
        userData.address = rest.address || "";
        // Make sure CLIENT never gets skills/title/bio
        delete userData.skills;
        delete userData.title;
        delete userData.bio;
    }
    const newUser = yield user_model_1.User.create(userData);
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, profilePicture } = payload;
    const exist = yield user_model_1.User.findOne({ email });
    if (exist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin already exists");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const admin = yield user_model_1.User.create({
        email,
        password: hashedPassword,
        name,
        profilePicture,
        role: user_interface_1.Role.ADMIN,
        isVerified: true,
        is_active: "ACTIVE",
    });
    const adminObject = admin.toObject();
    delete adminObject.password;
    delete adminObject.skills;
    delete adminObject.averageRating;
    // delete adminObject.location; 
    delete adminObject.bio;
    return adminObject;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers },
    };
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(id);
    if (!existingUser) {
        throw new Error("User not found.");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.profilePicture && existingUser.profilePicture) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingUser.profilePicture);
    }
    return updatedUser;
});
exports.UserServcies = {
    createUser,
    createAdmin,
    getAllUsers,
    updateUser
};
