"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const service_interface_1 = require("./service.interface"); // ServiceCategory যোগ করুন
const serviceStatusEnum = zod_1.z.nativeEnum(service_interface_1.ServiceStatus);
const serviceCategoryEnum = zod_1.z.nativeEnum(service_interface_1.ServiceCategory); // 💡 নতুন ক্যাটাগরি এনুম যোগ করা হলো
// 🛑 দ্রষ্টব্য: form-data থেকে আসা সমস্ত মান (Value) স্ট্রিং হয়।
// তাই Zod transform ব্যবহার করে সেগুলোকে number বা array তে রূপান্তর করতে হবে।
// =========================================================================
// 1. সার্ভিস তৈরি (POST)
// =========================================================================
exports.createServiceSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, "Title must be at least 5 characters long.")
        .max(100),
    description: zod_1.z
        .string()
        .min(20, "Description must be at least 20 characters long."),
    price: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val)) // এটি সবসময় সংখ্যায় রূপান্তর করবে
        .refine((val) => !isNaN(val) && val >= 1, "Price must be a positive number."),
    // 💡 ফিক্স: deliveryTime - এখন string OR number গ্রহণ করবে।
    deliveryTime: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val)) // এটি সবসময় সংখ্যায় রূপান্তর করবে
        .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 1, "Delivery time must be an integer of at least 1 day."),
    category: serviceCategoryEnum,
    // 💡 ফিক্স: tags - এখন string OR array গ্রহণ করবে।
    tags: zod_1.z
        .union([zod_1.z.array(zod_1.z.string()), zod_1.z.string()])
        .optional()
        .transform((val) => {
        if (Array.isArray(val))
            return val.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
        if (typeof val === "string" && val) {
            return val
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
        }
        return [];
    }),
    // profileImage: Multer/req.file এর কারণে এই ভ্যালিডেশন লাগবে না
    // কিন্তু যদি লাগে:
    // profileImage: z.string().url("Invalid image URL format").optional(),
});
// =========================================================================
// 2. সার্ভিস আপডেট (PATCH)
// =========================================================================
// =========================================================================
// 2. সার্ভিস আপডেট (PATCH) - ফিক্স
// =========================================================================
exports.updateServiceSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100).optional(),
    description: zod_1.z.string().min(20).optional(),
    // 💡 ফিক্স: price - এখন string OR number গ্রহণ করবে।
    price: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()]) // <--- FIX APPLIED
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 1, "Price must be a positive number.")
        .optional(),
    // 💡 ফিক্স: deliveryTime - এখন string OR number গ্রহণ করবে।
    deliveryTime: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()]) // <--- FIX APPLIED
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 1, "Delivery time must be an integer of at least 1 day.")
        .optional(),
    // 💡 ফিক্স: অনুমোদিত ক্যাটাগরি এনুম ব্যবহার করা
    category: serviceCategoryEnum.optional(),
    // 💡 ফিক্স: tags - এখন string OR array গ্রহণ করবে।
    tags: zod_1.z
        .union([zod_1.z.array(zod_1.z.string()), zod_1.z.string()]) // <--- FIX APPLIED
        .optional()
        .transform((val) => {
        // এই ট্রান্সফর্ম লজিকটি union এর উভয় ক্ষেত্রে কাজ করবে
        if (Array.isArray(val))
            return val.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
        if (typeof val === "string" && val) {
            return val
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
        }
        return [];
    }),
    status: serviceStatusEnum.optional(),
});
