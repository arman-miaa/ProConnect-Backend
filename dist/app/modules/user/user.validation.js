"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
// Role enum zod compatible হিসাবে
const roleEnum = zod_1.z.nativeEnum(user_interface_1.Role);
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long."),
    email: zod_1.z.string().email("Invalid email format."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long."),
    role: roleEnum.default(user_interface_1.Role.CLIENT), // সঠিকভাবে default সেট ✔
    title: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    address: zod_1.z.string().optional(),
    contactNumber: zod_1.z
        .string()
        .optional()
        .default("")
        .refine((val) => val === "" || /^\+?[0-9]{7,15}$/.test(val), {
        message: "Invalid contact  number",
    }),
    profilePicture: zod_1.z.string().url().optional(),
});
exports.updateUserSchema = exports.registerSchema
    .pick({
    name: true,
    title: true,
    bio: true,
    skills: true,
    address: true,
    contactNumber: true,
    profilePicture: true,
})
    .partial() // PICK করার পরে সমস্ত ফিল্ডকে ঐচ্ছিক করা হলো
    .extend({
    // কাস্টম ফিল্ড: প্রোফাইল পিকচার ডিলিট করার জন্য
    deleteProfilePicture: zod_1.z.boolean().optional(),
    // কাস্টম ফিল্ড: Postman form-data থেকে আসা JSON স্ট্রিং হ্যান্ডেল করার জন্য
    data: zod_1.z.any().optional(),
});
module.exports = {
    registerSchema: exports.registerSchema,
    updateUserSchema: exports.updateUserSchema
};
