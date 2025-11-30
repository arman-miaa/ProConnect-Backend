import { z } from "zod";
import {
  Role,
  Gender,
  BloodGroupType,
  DoctorType,
  PublicFigureType,
  OrganizationType,
  VerificationStatus,
} from "./user.interface";

// 🆕 Admin Create Schema (Admin-এর জন্য আলাদা এবং হালকা স্কিমা)
export const AdminCreateSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    photo: z.string().url("Invalid picture URL").optional(),

  })
 

// --- কমন সাব-স্কিমা ---
const SocialLinkSchema = z
  .object({
    platform: z.string().min(1, "Platform name is required"),
    url: z.string().url("Must be a valid URL"),
  })
  .strict();

// --- বেস রেজিস্ট্রেশন স্কিমা (সব রোলের জন্য কমন) ---
export const BaseRegistrationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Invalid phone number length")
    .optional(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),

  role: z.nativeEnum(Role, { required_error: "Role is required" }),
  address_district: z.string().min(1, "District is required"),
  address_thana: z.string().min(1, "Thana is required"),

  full_name: z.string().optional(),
  organization_name: z.string().optional(),
  picture: z.string().url("Invalid picture URL").optional(),
});

// --- ১. IProfilePersonal স্কিমা ---
export const PersonalSchema = BaseRegistrationSchema.extend({
  role: z.literal(Role.PERSONAL),
  full_name: z.string().min(2, "Full name is required for personal profile"),

  gender: z.nativeEnum(Gender),
  dob: z
    .string()
    .pipe(
      z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")
    ),
  blood_group_type: z.nativeEnum(BloodGroupType),
  weight: z.number().positive().optional(),
});

// --- ২. IDoctorProfile স্কিমা (Object ভার্সন) ---
export const DoctorSchemaObject = BaseRegistrationSchema.extend({
  role: z.literal(Role.DOCTOR),
  full_name: z.string().min(2, "Full name is required for doctor profile"),
  gender: z.nativeEnum(Gender),
  dob: z
    .string()
    .pipe(
      z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")
    ),
  specialization: z.nativeEnum(DoctorType),
  custom_specialization: z.string().trim().optional(),
  consultation_fee_first: z.number().positive("Fee must be positive"),
  consultation_fee_followup: z.number().positive("Fee must be positive"),
  avg_patient_time: z.number().int().min(5, "Min 5 mins per patient"),
  chamber_name: z.string().optional(),
  location_details: z.string().min(5, "Full chamber address is required"),
});

// --- ৩. IProfilePublicFigure স্কিমা (Object ভার্সন) ---
export const PublicFigureSchemaObject = BaseRegistrationSchema.extend({
  role: z.literal(Role.PUBLIC_FIGURE),
  full_name: z.string().min(2, "Full name is required"),
  gender: z.nativeEnum(Gender),
  dob: z
    .string()
    .pipe(
      z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")
    ),
  specialization: z.nativeEnum(PublicFigureType),
  custom_specialization: z.string().trim().optional(),
});

// --- ৪. IProfileOrganization স্কিমা (Object ভার্সন) ---
export const OrganizationSchemaObject = BaseRegistrationSchema.extend({
  role: z.literal(Role.ORGANIZATION),
  organization_name: z.string().min(2, "Organization name is required"),
  establishment_date: z
    .string()
    .pipe(
      z.coerce
        .date()
        .max(new Date(), "Establishment date cannot be in the future")
    ),
  is_blood_bank: z.boolean().default(false).optional(),
  license_number: z.string().optional(),
  specialization: z.nativeEnum(OrganizationType),
  custom_specialization: z.string().trim().optional(),
});

// --- ফাইনাল এক্সপোর্ট স্কিমা (Middleware-এর জন্য) ---
export const RegistrationSchema = z.discriminatedUnion("role", [
  PersonalSchema,
  DoctorSchemaObject,
  PublicFigureSchemaObject,
  OrganizationSchemaObject,
]);

export const FinalRegistrationSchema = RegistrationSchema.superRefine(
  (data, ctx) => {
    // Doctor - OTHER চেক
    if (
      data.role === Role.DOCTOR &&
      data.specialization === DoctorType.OTHER &&
      (!data.custom_specialization ||
        data.custom_specialization.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom specialization must be provided for Doctor.",
        path: ["custom_specialization"],
      });
    }

    // Public Figure - OTHER চেক
    if (
      data.role === Role.PUBLIC_FIGURE &&
      data.specialization === PublicFigureType.OTHER &&
      (!data.custom_specialization ||
        data.custom_specialization.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom specialization must be provided for Public Figure.",
        path: ["custom_specialization"],
      });
    }

    // Organization - OTHER চেক
    if (
      data.role === Role.ORGANIZATION &&
      data.specialization === OrganizationType.OTHER &&
      (!data.custom_specialization ||
        data.custom_specialization.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom specialization must be provided for Organization.",
        path: ["custom_specialization"],
      });
    }
  }
);

// 1. BaseUserUpdateSchema (User মডেলে কমন ফিল্ডগুলির জন্য)
export const BaseUserUpdateSchema = z
  .object({
    // কোর ইউজার ডেটা
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    full_name: z.string().min(2).optional(),
    organization_name: z.string().min(2).optional(),
    picture: z.string().url("Invalid picture URL").optional(),

    // সব প্রোফাইলে থাকা কমন অ্যাড্রেস
    address_district: z.string().min(1).optional(),
    address_thana: z.string().min(1).optional(),
    specialization: z
      .union([
        z.nativeEnum(DoctorType),
        z.nativeEnum(PublicFigureType),
        z.nativeEnum(OrganizationType),
      ])
      .optional(),
    custom_specialization: z.string().trim().optional(),

    // কমন প্রোফাইল ফিল্ড (যদি থাকে)
    social_links: z.array(SocialLinkSchema).optional(),
    verification_document_url: z.string().url().optional(),
    verification_status: z.nativeEnum(VerificationStatus).optional(),
    isOnline: z.boolean().optional(),
    lastSeen: z.coerce.date().nullable().optional(),
    is_green_verified: z.boolean().optional(),
    is_normal_verified: z.boolean().optional(),
    is_otp_verified: z.boolean().optional(),
    followers_count: z.number().optional(),
    following_count: z.number().optional(),
    role: z.nativeEnum(Role),
  })
  .strict()
  .partial(); 


// A. Personal Update Schema
export const PersonalUpdateSchema = BaseUserUpdateSchema.extend({
  // ✅ FIX: role কে literal হিসেবে রাখুন, optional নয়
  role: z.literal(Role.PERSONAL),

  gender: z.nativeEnum(Gender).optional(),
  dob: z.string().pipe(z.coerce.date().max(new Date())).optional(),
  blood_group_type: z.nativeEnum(BloodGroupType).optional(),
  weight: z.number().positive().optional(),
});

// B. Doctor Update Schema
export const DoctorUpdateSchema = BaseUserUpdateSchema.extend({
  role: z.literal(Role.DOCTOR),

  gender: z.nativeEnum(Gender).optional(),
  dob: z.string().pipe(z.coerce.date().max(new Date())).optional(),
  specialization: z.nativeEnum(DoctorType).optional(),
  custom_specialization: z.string().trim().optional(),
  consultation_fee_first: z.number().positive().optional(),
  consultation_fee_followup: z.number().positive().optional(),
  avg_patient_time: z.number().int().min(5).optional(),
  chamber_name: z.string().optional(),
  location_details: z.string().min(5).optional(),
});

// C. Public Figure Update Schema
export const PublicFigureUpdateSchema = BaseUserUpdateSchema.extend({
  role: z.literal(Role.PUBLIC_FIGURE),

  gender: z.nativeEnum(Gender).optional(),
  dob: z.string().pipe(z.coerce.date().max(new Date())).optional(),
  specialization: z.nativeEnum(PublicFigureType).optional(),
  custom_specialization: z.string().trim().optional(),
});

// D. Organization Update Schema
export const OrganizationUpdateSchema = BaseUserUpdateSchema.extend({
  role: z.literal(Role.ORGANIZATION),

  specialization: z.nativeEnum(OrganizationType).optional(),
  custom_specialization: z.string().trim().optional(),
  establishment_date: z
    .string()
    .pipe(z.coerce.date().max(new Date()))
    .optional(),
  is_blood_bank: z.boolean().optional(),
  license_number: z.string().optional(),
});
// E. Admin Update Schema
export const AdminUpdateSchema = BaseUserUpdateSchema.extend({
  role: z.literal(Role.ADMIN),
});

// F. Super Admin Update Schema
export const SuperAdminUpdateSchema = BaseUserUpdateSchema.extend({
  role: z.literal(Role.SUPER_ADMIN),
});


// 3. 🎯 FinalUpdateSchema: ডিস্ক্রিমিনেটেড ইউনিয়ন এখন কাজ করবে
export const FinalUpdateSchema = z
  .discriminatedUnion("role", [
    PersonalUpdateSchema,
    DoctorUpdateSchema,
    PublicFigureUpdateSchema,
    OrganizationUpdateSchema,
    AdminUpdateSchema,
    SuperAdminUpdateSchema,
    
  ])
  .superRefine((data, ctx) => {
    // ... OTHER চেক লজিক অপরিবর্তিত ...
    if (
      data.specialization &&
      data.specialization.toString().toUpperCase() === "OTHER" &&
      (!data.custom_specialization ||
        data.custom_specialization.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Custom specialization must be provided when 'Other' is selected during update.",
        path: ["custom_specialization"],
      });
    }
  });
