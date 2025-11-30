"use strict";
// modules/user/user.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOrganizationModel = exports.ProfilePublicFigureModel = exports.DoctorProfileModel = exports.ProfilePersonalModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
// --- কমন সাব-স্কিমা: সোশ্যাল লিঙ্কস ---
const SocialLinkSchema = new mongoose_1.Schema({
    platform: { type: String, required: true },
    url: {
        type: String,
        required: true,
        match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
    }, // URL Validation
}, { _id: false });
// --- কোর মডেল: IUser ---
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: { type: String, required: false, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(user_interface_1.Role) },
    is_active: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.IsActiv),
        default: user_interface_1.IsActiv.ACTIVE,
    },
    is_otp_verified: { type: Boolean, required: true, default: false },
    is_normal_verified: { type: Boolean, required: true, default: false },
    is_green_verified: { type: Boolean, required: true, default: false },
    blocked_by_admin_id: { type: mongoose_1.Types.ObjectId, required: false, ref: "Admin" },
    full_name: { type: String, trim: true },
    organization_name: { type: String, trim: true },
    picture: { type: String },
    profile_ref_id: { type: "ObjectId", required: false, ref: "Profile" },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
// --- প্রোফাইল মডেলস (৪টি কালেকশন) ---
// ১. IProfilePersonal Model
const ProfilePersonalSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        unique: true,
        ref: "User",
    },
    gender: { type: String, required: true, enum: Object.values(user_interface_1.Gender) },
    dob: { type: Date, required: true },
    blood_group_type: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.BloodGroupType),
    },
    weight: { type: Number },
    address_district: { type: String, required: true },
    address_thana: { type: String, required: true },
    verification_document_url: { type: String },
    verification_status: {
        type: String,
        enum: Object.values(user_interface_1.VerificationStatus),
        default: user_interface_1.VerificationStatus.NOT_APPLICABLE,
    },
    social_links: [SocialLinkSchema],
});
exports.ProfilePersonalModel = (0, mongoose_1.model)("ProfilePersonal", ProfilePersonalSchema);
// ২. IDoctorProfile Model
const DoctorProfileSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    gender: { type: String, required: true, enum: Object.values(user_interface_1.Gender) },
    dob: { type: Date, required: true },
    specialization: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.DoctorType),
    },
    custom_specialization: { type: String, trim: true }, // কাস্টম ফিল্ড
    consultation_fee_first: { type: Number, required: true },
    consultation_fee_followup: { type: Number, required: true },
    avg_patient_time: { type: Number, required: true },
    chamber_name: { type: String, trim: true },
    location_details: { type: String, required: true },
    address_district: { type: String, required: true },
    address_thana: { type: String, required: true },
    verification_document_url: { type: String },
    verification_status: {
        type: String,
        enum: Object.values(user_interface_1.VerificationStatus),
        default: user_interface_1.VerificationStatus.NOT_APPLICABLE,
    },
    social_links: [SocialLinkSchema],
});
exports.DoctorProfileModel = (0, mongoose_1.model)("DoctorProfile", DoctorProfileSchema);
// ৩. IProfilePublicFigure Model
const ProfilePublicFigureSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    gender: { type: String, required: true, enum: Object.values(user_interface_1.Gender) },
    dob: { type: Date, required: true },
    specialization: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.PublicFigureType),
    },
    custom_specialization: { type: String, trim: true }, // কাস্টম ফিল্ড
    address_district: { type: String, required: true },
    address_thana: { type: String, required: true },
    verification_document_url: { type: String },
    verification_status: {
        type: String,
        enum: Object.values(user_interface_1.VerificationStatus),
        default: user_interface_1.VerificationStatus.NOT_APPLICABLE,
    },
    social_links: [SocialLinkSchema],
});
exports.ProfilePublicFigureModel = (0, mongoose_1.model)("ProfilePublicFigure", ProfilePublicFigureSchema);
// ৪. IProfileOrganization Model
const ProfileOrganizationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    specialization: {
        type: String,
        required: true,
        enum: Object.values(user_interface_1.OrganizationType),
    },
    custom_specialization: { type: String, trim: true }, // কাস্টম ফিল্ড
    establishment_date: { type: Date, required: true },
    is_blood_bank: { type: Boolean, default: false },
    address_district: { type: String, required: true },
    address_thana: { type: String, required: true },
    license_number: { type: String, trim: true },
    verification_document_url: { type: String },
    verification_status: {
        type: String,
        enum: Object.values(user_interface_1.VerificationStatus),
        default: user_interface_1.VerificationStatus.NOT_APPLICABLE,
    },
    social_links: [SocialLinkSchema],
});
exports.ProfileOrganizationModel = (0, mongoose_1.model)("ProfileOrganization", ProfileOrganizationSchema);
