"use strict";
// src/models/User.model.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: user_interface_1.Role,
        default: "CLIENT",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: String,
        enum: Object.values(user_interface_1.IsActiv),
        default: user_interface_1.IsActiv.ACTIVE,
        required: true,
    },
    // seller–specific fields
    address: {
        type: String,
        trim: true,
        default: undefined,
    },
    bio: {
        type: String,
        trim: true,
        default: undefined,
    },
    title: {
        type: String,
        trim: true,
        default: undefined,
    },
    skills: {
        type: [String],
        default: undefined,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    averageRating: {
        type: Number,
        default: function () {
            // শুধুমাত্র SELLER-এর জন্য 0, অন্যদের undefined
            return this.role === "SELLER" ? 0 : undefined;
        },
    },
    contactNumber: {
        type: String,
        trim: true,
        default: "",
        match: [/^\+?[0-9]{7,15}$/, "Invalid contactNumber number"],
    },
}, { timestamps: true });
// ভবিষ্যতে পাসওয়ার্ড হ্যাশিং (Hashing) এখানে যুক্ত করা হবে
exports.User = mongoose_1.default.model("User", userSchema);
