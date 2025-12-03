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
        minlength: 6, // নিরাপত্তার জন্য
        select: false, // পাসওয়ার্ড ডিফল্টভাবে কোয়েরিতে আসবে না
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
        enum: Object.values(user_interface_1.IsActiv), // IsActiv Enum থেকে ভ্যালু নেওয়া হলো
        default: user_interface_1.IsActiv.ACTIVE, // ডিফল্টভাবে ACTIVE সেট করা হলো
        required: true,
    },
    // সেলারের জন্য অতিরিক্ত ফিল্ড
    location: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    skills: {
        type: [String], // Array of Strings
        default: [],
    },
    profilePicture: {
        type: String,
        default: "",
    },
    averageRating: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // createdAt, updatedAt যোগ করবে
});
// ভবিষ্যতে পাসওয়ার্ড হ্যাশিং (Hashing) এখানে যুক্ত করা হবে
exports.User = mongoose_1.default.model("User", userSchema);
