"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_services_1 = require("./user.services");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_services_1.UserServcies.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
const createAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_services_1.UserServcies.createAdmin(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Admin created successfully",
        data: admin,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.user.userId;
    // console.log("upated data..............",req.body);
    // console.log(id,"id",req.body);
    const payload = Object.assign(Object.assign({}, req.body), { profilePicture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield user_services_1.UserServcies.updateUser(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
}));
// =================== Admin Updating Other Users ===================
const adminUpdateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updateData = req.body;
    const result = yield user_services_1.UserServcies.adminUpdateUser(userId, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User updated successfully by admin",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServcies.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All users Retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
// GET ALL ADMINS
const getAllAdmins = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield user_services_1.UserServcies.getAllAdmins();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All admins fetched successfully",
        data: admins,
    });
}));
// DELETE ADMIN
const deleteAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.UserServcies.deleteAdmin(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
}));
exports.UserControllers = {
    createUser,
    createAdmin,
    updateUser,
    adminUpdateUser,
    getAllUsers,
    getAllAdmins,
    deleteAdmin
};
