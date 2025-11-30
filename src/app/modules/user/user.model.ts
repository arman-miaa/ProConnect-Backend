// modules/user/user.model.ts

import { Schema, Types, model } from "mongoose";
import {
  IUser,
  IProfilePersonal,
  IDoctorProfile,
  IProfilePublicFigure,
  IProfileOrganization,
  Role,
  IsActiv,
  Gender,
  BloodGroupType,
  DoctorType,
  PublicFigureType,
  OrganizationType,
  VerificationStatus,
} from "./user.interface";


// --- কমন সাব-স্কিমা: সোশ্যাল লিঙ্কস ---
const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: {
      type: String,
      required: true,
      match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
    }, // URL Validation
  },
  { _id: false }
);

// --- কোর মডেল: IUser ---
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: false, trim: true },
    password: { type: String, required: true },

    role: { type: String, required: true, enum: Object.values(Role) },
    is_active: {
      type: String,
      required: true,
      enum: Object.values(IsActiv),
      default: IsActiv.ACTIVE,
    },
    is_otp_verified: { type: Boolean, required: true, default: false },
    is_normal_verified: { type: Boolean, required: true, default: false },
    is_green_verified: { type: Boolean, required: true, default: false },
    blocked_by_admin_id: {
      type: Types.ObjectId,
      required: false,
      ref: "Admin",
    },
    full_name: { type: String, trim: true },
    organization_name: { type: String, trim: true },
    picture: { type: String },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    profile_ref_id: { type: "ObjectId", required: false, ref: "Profile" },
    followers_count: {
      type: Number,
      required: true, 
      default: 0,
    },
    following_count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);

// --- প্রোফাইল মডেলস (৪টি কালেকশন) ---

// ১. IProfilePersonal Model
const ProfilePersonalSchema = new Schema<IProfilePersonal>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: false,
    unique: true,
    ref: "User",
  },

  gender: { type: String, required: true, enum: Object.values(Gender) },
  dob: { type: Date, required: true },
  blood_group_type: {
    type: String,
    required: true,
    enum: Object.values(BloodGroupType),
  },
  weight: { type: Number },

  address_district: { type: String, required: true },
  address_thana: { type: String, required: true },

  verification_document_url: { type: String },
  verification_status: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.NOT_APPLICABLE,
  },
  social_links: [SocialLinkSchema], 
});
export const ProfilePersonalModel = model<IProfilePersonal>(
  "ProfilePersonal",
  ProfilePersonalSchema
);

// ২. IDoctorProfile Model
const DoctorProfileSchema = new Schema<IDoctorProfile>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },

  gender: { type: String, required: true, enum: Object.values(Gender) },
  dob: { type: Date, required: true },

  specialization: {
    type: String,
    required: true,
    enum: Object.values(DoctorType),
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
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.NOT_APPLICABLE,
  },
  social_links: [SocialLinkSchema],
});
export const DoctorProfileModel = model<IDoctorProfile>(
  "DoctorProfile",
  DoctorProfileSchema
);

// ৩. IProfilePublicFigure Model
const ProfilePublicFigureSchema = new Schema<IProfilePublicFigure>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },

  gender: { type: String, required: true, enum: Object.values(Gender) },
  dob: { type: Date, required: true },

  specialization: {
    type: String,
    required: true,
    enum: Object.values(PublicFigureType),
  },
  custom_specialization: { type: String, trim: true }, // কাস্টম ফিল্ড

  address_district: { type: String, required: true },
  address_thana: { type: String, required: true },

  verification_document_url: { type: String },
  verification_status: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.NOT_APPLICABLE,
  },
  social_links: [SocialLinkSchema],
});
export const ProfilePublicFigureModel = model<IProfilePublicFigure>(
  "ProfilePublicFigure",
  ProfilePublicFigureSchema
);

// ৪. IProfileOrganization Model
const ProfileOrganizationSchema = new Schema<IProfileOrganization>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },

  specialization: {
    type: String,
    required: true,
    enum: Object.values(OrganizationType),
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
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.NOT_APPLICABLE,
  },
  social_links: [SocialLinkSchema],
});
export const ProfileOrganizationModel = model<IProfileOrganization>(
  "ProfileOrganization",
  ProfileOrganizationSchema
);
