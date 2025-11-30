"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalUpdateSchema = exports.OrganizationUpdateSchema = exports.PublicFigureUpdateSchema = exports.DoctorUpdateSchema = exports.PersonalUpdateSchema = exports.BaseUserUpdateSchema = exports.FinalRegistrationSchema = exports.RegistrationSchema = exports.OrganizationSchemaObject = exports.PublicFigureSchemaObject = exports.DoctorSchemaObject = exports.PersonalSchema = exports.BaseRegistrationSchema = exports.AdminCreateSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
// --- কমন সাব-স্কিমা ---
const SocialLinkSchema = zod_1.z
    .object({
    platform: zod_1.z.string().min(1, "Platform name is required"),
    url: zod_1.z.string().url("Must be a valid URL"),
})
    .strict();
// admin shema 
exports.AdminCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    photo: zod_1.z.string().url().optional(),
});
// --- বেস রেজিস্ট্রেশন স্কিমা (সব রোলের জন্য কমন) ---
exports.BaseRegistrationSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    phone: zod_1.z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Invalid phone number length")
        .optional(), // ERD অনুযায়ী এটি অপশনাল
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
    // ERD অনুযায়ী এটি বাধ্যতামূলক এবং সঠিক enum ভ্যালু হতে হবে।
    role: zod_1.z.nativeEnum(user_interface_1.Role, { required_error: "Role is required" }),
    address_district: zod_1.z.string().min(1, "District is required"),
    address_thana: zod_1.z.string().min(1, "Thana is required"),
    full_name: zod_1.z.string().optional(),
    organization_name: zod_1.z.string().optional(),
    picture: zod_1.z.string().url("Invalid picture URL").optional(),
});
// --- ১. IProfilePersonal স্কিমা ---
// ✅ PersonalSchema এ superRefine নেই, তাই এটি ZodObject হিসেবে থাকবে
exports.PersonalSchema = exports.BaseRegistrationSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.PERSONAL),
    full_name: zod_1.z.string().min(2, "Full name is required for personal profile"),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender),
    dob: zod_1.z
        .string()
        .pipe(zod_1.z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")),
    blood_group_type: zod_1.z.nativeEnum(user_interface_1.BloodGroupType),
    weight: zod_1.z.number().positive().optional(),
});
// --- ২. IDoctorProfile স্কিমা (Object ভার্সন) ---
// ✅ ডিস্ক্রিমিনেটেড ইউনিয়নে ব্যবহারের জন্য শুধু ZodObject ডেফিনিশন
exports.DoctorSchemaObject = exports.BaseRegistrationSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.DOCTOR),
    full_name: zod_1.z.string().min(2, "Full name is required for doctor profile"),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender),
    dob: zod_1.z
        .string()
        .pipe(zod_1.z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")),
    specialization: zod_1.z.nativeEnum(user_interface_1.DoctorType),
    custom_specialization: zod_1.z.string().trim().optional(),
    consultation_fee_first: zod_1.z.number().positive("Fee must be positive"),
    consultation_fee_followup: zod_1.z.number().positive("Fee must be positive"),
    avg_patient_time: zod_1.z.number().int().min(5, "Min 5 mins per patient"),
    chamber_name: zod_1.z.string().optional(),
    location_details: zod_1.z.string().min(5, "Full chamber address is required"),
});
// --- ৩. IProfilePublicFigure স্কিমা (Object ভার্সন) ---
// ✅ ডিস্ক্রিমিনেটেড ইউনিয়নে ব্যবহারের জন্য শুধু ZodObject ডেফিনিশন
exports.PublicFigureSchemaObject = exports.BaseRegistrationSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.PUBLIC_FIGURE),
    full_name: zod_1.z.string().min(2, "Full name is required"),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender),
    dob: zod_1.z
        .string()
        .pipe(zod_1.z.coerce.date().max(new Date(), "Date of Birth cannot be in the future")),
    specialization: zod_1.z.nativeEnum(user_interface_1.PublicFigureType),
    custom_specialization: zod_1.z.string().trim().optional(),
});
// --- ৪. IProfileOrganization স্কিমা (Object ভার্সন) ---
// ✅ ডিস্ক্রিমিনেটেড ইউনিয়নে ব্যবহারের জন্য শুধু ZodObject ডেফিনিশন
exports.OrganizationSchemaObject = exports.BaseRegistrationSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.ORGANIZATION),
    organization_name: zod_1.z.string().min(2, "Organization name is required"),
    establishment_date: zod_1.z
        .string()
        .pipe(zod_1.z.coerce
        .date()
        .max(new Date(), "Establishment date cannot be in the future")),
    is_blood_bank: zod_1.z.boolean().default(false).optional(),
    license_number: zod_1.z.string().optional(),
    specialization: zod_1.z.nativeEnum(user_interface_1.OrganizationType),
    custom_specialization: zod_1.z.string().trim().optional(),
});
// --- ফাইনাল এক্সপোর্ট স্কিমা (Middleware-এর জন্য) ---
// 🎯 ১. ZodObject ব্যবহার করে RegistrationSchema তৈরি করা হলো (No Error)
exports.RegistrationSchema = zod_1.z.discriminatedUnion("role", [
    exports.PersonalSchema,
    exports.DoctorSchemaObject, // Object ভার্সন
    exports.PublicFigureSchemaObject, // Object ভার্সন
    exports.OrganizationSchemaObject, // Object ভার্সন
]);
// 🎯 ২. superRefine লজিকটি পুরো Union স্কিমার উপর প্রয়োগ করা হলো (Final Schema)
exports.FinalRegistrationSchema = exports.RegistrationSchema.superRefine((data, ctx) => {
    // Doctor - OTHER চেক
    if (data.role === user_interface_1.Role.DOCTOR &&
        data.specialization === user_interface_1.DoctorType.OTHER &&
        (!data.custom_specialization ||
            data.custom_specialization.trim().length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Custom specialization must be provided for Doctor.",
            path: ["custom_specialization"],
        });
    }
    // Public Figure - OTHER চেক
    if (data.role === user_interface_1.Role.PUBLIC_FIGURE &&
        data.specialization === user_interface_1.PublicFigureType.OTHER &&
        (!data.custom_specialization ||
            data.custom_specialization.trim().length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Custom specialization must be provided for Public Figure.",
            path: ["custom_specialization"],
        });
    }
    // Organization - OTHER চেক
    if (data.role === user_interface_1.Role.ORGANIZATION &&
        data.specialization === user_interface_1.OrganizationType.OTHER &&
        (!data.custom_specialization ||
            data.custom_specialization.trim().length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Custom specialization must be provided for Organization.",
            path: ["custom_specialization"],
        });
    }
});
// 💡 Note: আপনার রাউট ফাইলে (user.route.ts) validateRequest(FinalRegistrationSchema) ব্যবহার করুন।
// 1. BaseUserUpdateSchema (User মডেলে কমন ফিল্ডগুলির জন্য)
// BaseRegistrationSchema থেকে শুধু প্রয়োজনীয় ফিল্ড নিয়ে partial করা হয়েছে
exports.BaseUserUpdateSchema = zod_1.z
    .object({
    // কোর ইউজার ডেটা
    // Password আপডেটের জন্য:
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    // IUser কমন নেম ফিল্ড
    full_name: zod_1.z.string().min(2).optional(),
    organization_name: zod_1.z.string().min(2).optional(),
    picture: zod_1.z.string().url("Invalid picture URL").optional(),
    // সব প্রোফাইলে থাকা কমন অ্যাড্রেস
    address_district: zod_1.z.string().min(1).optional(),
    address_thana: zod_1.z.string().min(1).optional(),
    specialization: zod_1.z
        .union([
        zod_1.z.nativeEnum(user_interface_1.DoctorType),
        zod_1.z.nativeEnum(user_interface_1.PublicFigureType),
        zod_1.z.nativeEnum(user_interface_1.OrganizationType),
    ])
        .optional(),
    custom_specialization: zod_1.z.string().trim().optional(),
    // কমন প্রোফাইল ফিল্ড (যদি থাকে)
    social_links: zod_1.z.array(SocialLinkSchema).optional(),
    verification_document_url: zod_1.z.string().url().optional(),
    verification_status: zod_1.z.nativeEnum(user_interface_1.VerificationStatus).optional(),
    // ডিস্ক্রিমিনেটেড ইউনিয়নের জন্য 'role' ঐচ্ছিক রাখা হলো।
    role: zod_1.z.nativeEnum(user_interface_1.Role).optional(),
})
    .strict()
    .partial(); // ✅ সবগুলো ফিল্ডই ঐচ্ছিক (Optional)
// 2. রোল-নির্দিষ্ট আপডেট স্কিমা তৈরি (BaseUserUpdateSchema থেকে এক্সটেন্ড করা হয়েছে)
// প্রতিটি আপডেটে শুধুমাত্র তার রোলের ফিল্ডগুলি ঐচ্ছিকভাবে বৈধ হবে।
// A. Personal Update Schema
exports.PersonalUpdateSchema = exports.BaseUserUpdateSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.PERSONAL).optional(),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender).optional(),
    dob: zod_1.z.string().pipe(zod_1.z.coerce.date().max(new Date())).optional(),
    blood_group_type: zod_1.z.nativeEnum(user_interface_1.BloodGroupType).optional(),
    weight: zod_1.z.number().positive().optional(),
}).partial();
// B. Doctor Update Schema
exports.DoctorUpdateSchema = exports.BaseUserUpdateSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.DOCTOR).optional(),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender).optional(),
    dob: zod_1.z.string().pipe(zod_1.z.coerce.date().max(new Date())).optional(),
    specialization: zod_1.z.nativeEnum(user_interface_1.DoctorType).optional(),
    custom_specialization: zod_1.z.string().trim().optional(),
    consultation_fee_first: zod_1.z.number().positive().optional(),
    consultation_fee_followup: zod_1.z.number().positive().optional(),
    avg_patient_time: zod_1.z.number().int().min(5).optional(),
    chamber_name: zod_1.z.string().optional(),
    location_details: zod_1.z.string().min(5).optional(),
}).partial();
// C. Public Figure Update Schema
exports.PublicFigureUpdateSchema = exports.BaseUserUpdateSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.PUBLIC_FIGURE).optional(),
    gender: zod_1.z.nativeEnum(user_interface_1.Gender).optional(),
    dob: zod_1.z.string().pipe(zod_1.z.coerce.date().max(new Date())).optional(),
    specialization: zod_1.z.nativeEnum(user_interface_1.PublicFigureType).optional(),
    custom_specialization: zod_1.z.string().trim().optional(),
}).partial();
// D. Organization Update Schema
exports.OrganizationUpdateSchema = exports.BaseUserUpdateSchema.extend({
    role: zod_1.z.literal(user_interface_1.Role.ORGANIZATION).optional(),
    specialization: zod_1.z.nativeEnum(user_interface_1.OrganizationType).optional(),
    custom_specialization: zod_1.z.string().trim().optional(),
    establishment_date: zod_1.z.string().pipe(zod_1.z.coerce.date().max(new Date())).optional(),
    is_blood_bank: zod_1.z.boolean().optional(),
    license_number: zod_1.z.string().optional(),
}).partial();
// 3. 🎯 FinalUpdateSchema: ডিস্ক্রিমিনেটেড ইউনিয়ন এবং superRefine
exports.FinalUpdateSchema = zod_1.z.discriminatedUnion("role", [
    exports.PersonalUpdateSchema,
    exports.DoctorUpdateSchema,
    exports.PublicFigureUpdateSchema,
    exports.OrganizationUpdateSchema,
])
    // ✅ superRefine: OTHER চেক শুধুমাত্র আপডেট করার জন্য
    .superRefine((data, ctx) => {
    // এই লজিকটি তখনই চলবে যখন ইউজার specialization ফিল্ডটি পাঠাবে।
    if (data.specialization &&
        data.specialization.toString().toUpperCase() === "OTHER" &&
        (!data.custom_specialization ||
            data.custom_specialization.trim().length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Custom specialization must be provided when 'Other' is selected during update.",
            path: ["custom_specialization"],
        });
    }
});
// 💡 ব্যবহারের নোট:
// আপনার আপডেট কন্ট্রোলারে (user.controller.ts) validateRequest(FinalUpdateSchema) ব্যবহার করুন।
// সার্ভিস ফাংশনে (user.service.ts) role চেক করার প্রয়োজন নেই যদি ক্লায়েন্ট role না পাঠায়।
// যদি role পাঠানো হয়, তবে এটি Zod-এর মাধ্যমে সেই specific role-এর ফিল্ড ভ্যালিডেট করবে।
