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
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const user_model_1 = require("../user/user.model");
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email }).select("+password");
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    const userObject = isUserExist.toObject();
    const { password: pass, skills, averageRating, location, bio } = userObject, rest = __rest(userObject, ["password", "skills", "averageRating", "location", "bio"]);
    const userTokens = (0, userTokens_1.createUserTokens)(rest);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest, // rest এ শুধু প্রয়োজনীয় ডেটা থাকবে
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
const resetPassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password is incorrect");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // এখানে আপনি JWT পেলোডটি পাচ্ছেন, টোকেন আবার ডিকোড করার দরকার নেই
    const userData = yield user_model_1.User.findOne({
        email: decodedToken.email, // JWT থেকে ইমেল ব্যবহার করে ইউজার খুঁজুন
        // status: UserStatus.ACTIVE, // যদি UserStatus.ACTIVE আপনার ইউজার মডেলে না থাকে তবে এটি সরিয়ে দিন
    }).select("-password"); // পাসওয়ার্ড বাদ দিয়ে বাকি সব ডেটা আনুন
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found or is inactive.");
    }
    // ✅ গুরুত্বপূর্ণ: toObject() ব্যবহার করে Mongoose ডকুমেন্টকে প্লেন JS অবজেক্টে রূপান্তর করুন
    const userObject = userData.toObject();
    // আপনার login লজিকের মতো অপ্রয়োজনীয় ফিল্ডগুলো সরিয়ে দিন
    const { skills, averageRating, location, bio } = userObject, 
    // ... আপনার ইউজার মডেলে থাকা অন্যান্য সাব-ডকুমেন্ট
    rest = __rest(userObject, ["skills", "averageRating", "location", "bio"]);
    // ফ্রন্টএন্ডের সুবিধার জন্য পুরো ইউজার অবজেক্টটি রিটার্ন করুন
    return rest;
});
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    getMe,
};
