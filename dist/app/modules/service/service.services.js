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
exports.ServiceServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const service_model_1 = require("./service.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
// 1. সার্ভিস তৈরি (বিক্রেতা কর্তৃক)
const createService = (sellerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceData = Object.assign(Object.assign({}, payload), { sellerId });
    const newService = yield service_model_1.Service.create(serviceData);
    return newService;
});
// 2. সার্ভিস তালিকা দেখা (সমস্ত ব্যবহারকারী)
const getAllServices = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, search, minPrice, maxPrice } = query, filters = __rest(query, ["category", "search", "minPrice", "maxPrice"]);
    const filter = { isDeleted: false, status: "LIVE" };
    if (category) {
        filter.category = category;
    }
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice)
            filter.price.$gte = Number(minPrice);
        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
    }
    if (search) {
        // দ্রুত খোঁজার জন্য text index ব্যবহার
        filter.$text = { $search: search };
    }
    // সেলারের নাম ও রেটিং পপুলেট করা হলো
    const services = yield service_model_1.Service.find(filter).populate("sellerId", "name profilePicture averageRating");
    return services;
});
// 3. একটি নির্দিষ্ট সার্ভিস দেখা
const getServiceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(id).populate("sellerId", "name email profilePicture averageRating bio");
    if (!service || service.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Service not found.");
    }
    return service;
});
// 4. সার্ভিস আপডেট করা (বিক্রেতা কর্তৃক)
const updateService = (serviceId, sellerId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service || service.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Service not found.");
    }
    // নিশ্চিত করা যে শুধুমাত্র সেলারই তার সার্ভিস আপডেট করতে পারে
    if (service.sellerId.toString() !== sellerId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update this service.");
    }
    // ⚠️ যদি ইমেজ পরিবর্তন হয়, পুরনো ইমেজ ক্লাউডিনারি থেকে ডিলেট করার লজিক এখানে যুক্ত হবে
    // যেমন: if (updateData.images) { deleteOldImages(service.images); }
    if (service.image && service.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(service.image);
    }
    const updatedService = yield service_model_1.Service.findByIdAndUpdate(serviceId, updateData, { new: true, runValidators: true });
    return updatedService;
});
// 5. সার্ভিস ডিলেট করা (সফট ডিলেট - বিক্রেতা কর্তৃক)
const deleteService = (serviceId, sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(serviceId);
    if (!service || service.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Service not found.");
    }
    if (service.sellerId.toString() !== sellerId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to delete this service.");
    }
    // সফট ডিলেট: isDeleted: true এবং স্ট্যাটাস PAUSED করা হলো
    const result = yield service_model_1.Service.findByIdAndUpdate(serviceId, { isDeleted: true, status: "PAUSED" }, { new: true });
    return result;
});
exports.ServiceServices = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
