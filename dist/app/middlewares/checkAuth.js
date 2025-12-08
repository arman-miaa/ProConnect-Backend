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
exports.checkAuth = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies["accessToken"] || req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No token provided");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = yield user_model_1.User.findOne({
            email: verifiedToken.email,
        });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_2.default.BAD_REQUEST, "User does not exist");
        }
        // 🚫 BLOCKED / INACTIVE user detect
        if (isUserExist.is_active === user_interface_1.IsActiv.BLOCKED ||
            isUserExist.is_active === user_interface_1.IsActiv.INACTIVE) {
            // 🔥 Force logout
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            throw new AppError_1.default(http_status_codes_2.default.UNAUTHORIZED, `Your account is ${isUserExist.is_active}. You have been logged out.`);
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to access this resource");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
