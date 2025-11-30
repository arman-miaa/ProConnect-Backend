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
const user_model_1 = require("./user.model");
const profileCreator_1 = require("../../helpers/profileCreator");
const env_1 = require("../../config/env");
const user_interface_1 = require("./user.interface");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phone, role } = payload, rest = __rest(payload, ["email", "password", "phone", "role"]);
    // check existing user
    const isUserExist = yield user_model_1.UserModel.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    // hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // create user
    const user = yield user_model_1.UserModel.create({
        email,
        password: hashedPassword,
        role,
        phone,
        full_name: rest.full_name,
        organization_name: rest.organization_name,
        picture: rest.picture,
    });
    // create profile by role
    const profile = yield (0, profileCreator_1.createProfileByRole)(role, user._id, rest);
    // assign profile_ref_id
    if (profile) {
        user.profile_ref_id = profile._id;
        yield user.save();
    }
    const result = Object.assign(Object.assign({}, user.toObject()), { profile: profile ? profile.toObject() : null });
    return result;
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, photo } = payload;
    const exist = yield user_model_1.UserModel.findOne({ email });
    if (exist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin already exists");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const admin = yield user_model_1.UserModel.create({
        email,
        password: hashedPassword,
        full_name: name,
        picture: photo,
        role: user_interface_1.Role.ADMIN,
        is_active: true,
        is_otp_verified: true,
        is_normal_verified: true,
        is_green_verified: true,
    });
    return admin;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserModel.find({});
    const totalUsers = yield user_model_1.UserModel.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers },
    };
});
exports.UserServcies = {
    createUser,
    createAdmin,
    getAllUsers,
};
