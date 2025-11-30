// modules/user/user.interface.ts

import { Types } from "mongoose";

// --- নতুন ENUMS: ভেরিফিকেশন ও সোশ্যাল লিঙ্কস ---
export enum VerificationStatus {
  NOT_APPLICABLE = "NOT_APPLICABLE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ISocialLink {
  platform: string; // যেমন: 'Facebook', 'LinkedIn', 'Instagram'
  url: string;
}

// --- কোর ENUMS (কোর ডেটা ও রোল) ---
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  PERSONAL = "PERSONAL",
  DOCTOR = "DOCTOR",
  PUBLIC_FIGURE = "PUBLIC_FIGURE",
  ORGANIZATION = "ORGANIZATION",
}

export enum IsActiv {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export interface IAuthProvider {
  provider: "credentials";
  providerId: string;
}

export enum BloodGroupType {
  APositive = "A+",
  ANegative = "A-",
  BPositive = "B+",
  BNegative = "B-",
  ABPositive = "AB+",
  ABNegative = "AB-",
  OPositive = "O+",
  ONegative = "O-",
}

// --- 🎯 ইউজার রোল-ভিত্তিক ENUMS (সম্পূর্ণ তালিকা সহ) ---
export enum DoctorType {
  MEDICINE = "Medicine",
  CHILD_SPECIALIST = "Child Specialist",
  GYNECOLOGY = "Gynecology",
  HEART_SPECIALIST = "Heart Specialist",
  NEURO_SPECIALIST = "Neuro Specialist",
  ORTHOPEDIC = "Orthopedic",
  SKIN_SEX = "Skin & Sex",
  EYE_SPECIALIST = "Eye Specialist",
  ENT_SPECIALIST = "ENT Specialist",
  DENTAL = "Dental",
  MENTAL_HEALTH = "Mental Health",
  KIDNEY = "Kidney",
  STOMACH_LIVER = "Stomach & Liver",
  DIABETES_HORMONE = "Diabetes & Hormone",
  CANCER = "Cancer",
  CHEST_ASTHMA = "Chest & Asthma",
  SURGERY = "Surgery",
  PATHOLOGY = "Pathology",
  RADIOLOGY = "Radiology",
  EMERGENCY = "Emergency",
  OTHER = "Other", // কাস্টম ইনপুটের জন্য
}

export enum PublicFigureType {
  SOCIAL_WORKER = "Social Worker",
  ACTOR = "Actor",
  SINGER = "Singer",
  SPORTS_PERSONALITY = "Sports Personality",
  JOURNALIST = "Journalist",
  CONTENT_CREATOR = "Content Creator",
  POLITICIAN = "Politician",
  BUSINESSPERSON = "Businessperson",
  OTHER = "Other", // কাস্টম ইনপুটের জন্য
}

export enum OrganizationType {
  RELIGIOUS = "Religious Organization",
  ORPHANAGE = "Orphanage",
  OLD_AGE_HOME = "Old Age Home",
  FOUNDATION = "Foundation",
  DISABILITY_SUPPORT = "Disability Support Organization",
  FOOD_AID = "Food Aid Agency",
  HOSPITAL = "Hospital",
  RELIEF = "Relief Organization",
  SOCIAL_WELFARE = "Social Welfare Organization",
  RESEARCH_INSTITUTE = "Research Institute",
  OTHER = "Other", // কাস্টম ইনপুটের জন্য
}

// --- CORE USER INTERFACE (IUser) ---
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  is_active: IsActiv;
  isOnline: boolean;
  lastSeen: Date | null;
  is_otp_verified: boolean;
  is_normal_verified?: boolean;
  is_green_verified?: boolean;
  blocked_by_admin_id?: Types.ObjectId;
  full_name?: string;
  organization_name?: string;
  picture?: string;
  profile_ref_id?: Types.ObjectId;
  followers_count: number; 
  following_count: number; 
  createdAt: Date;
  updatedAt: Date;
}

// --- SEPARATE PROFILE INTERFACES (৪টি মডেল) ---

// ১. ব্যক্তিগত প্রোফাইল: IProfilePersonal
export interface IProfilePersonal {
  _id: string;
  user_id: Types.ObjectId;

  gender: Gender;
  dob: Date;
  blood_group_type: BloodGroupType;
  weight?: number;

  address_district: string;
  address_thana: string;

  verification_document_url?: string;
  verification_status?: VerificationStatus;
  social_links?: ISocialLink[];
}

// ২. ডাক্তারের প্রোফাইল: IDoctorProfile
export interface IDoctorProfile {
  _id: string;
  user_id: Types.ObjectId;

  gender: Gender;
  dob: Date;

  // Doctor Specific (Enum + Custom)
  specialization: DoctorType; // Enum ব্যবহার করা হয়েছে
  custom_specialization?: string; // কাস্টম ইনপুট ফিল্ড

  consultation_fee_first: number;
  consultation_fee_followup: number;
  avg_patient_time: number;
  chamber_name?: string;
  location_details: string;
  address_district: string;
  address_thana: string;

  verification_document_url?: string;
  verification_status?: VerificationStatus;
  social_links?: ISocialLink[];
}

// ৩. পাবলিক ফিগারের প্রোফাইল: IProfilePublicFigure
export interface IProfilePublicFigure {
  _id: string;
  user_id: Types.ObjectId;

  gender: Gender;
  dob: Date;

  // Public Figure Specific (Enum + Custom)
  specialization: PublicFigureType; // Enum ব্যবহার করা হয়েছে
  custom_specialization?: string; // কাস্টম ইনপুট ফিল্ড

  address_district: string;
  address_thana: string;

  verification_document_url?: string;
  verification_status?: VerificationStatus;
  social_links?: ISocialLink[];
}

// ৪. প্রতিষ্ঠানের প্রোফাইল: IProfileOrganization
export interface IProfileOrganization {
  _id: string;
  user_id: Types.ObjectId;

  // Organization Specific (Enum + Custom)
  specialization: OrganizationType; // Enum ব্যবহার করা হয়েছে
  custom_specialization?: string; // কাস্টম ইনপুট ফিল্ড

  establishment_date: Date;
  is_blood_bank: boolean;
  address_district: string;
  address_thana: string;

  license_number?: string;
  verification_document_url?: string;
  verification_status?: VerificationStatus;
  social_links?: ISocialLink[];
}
