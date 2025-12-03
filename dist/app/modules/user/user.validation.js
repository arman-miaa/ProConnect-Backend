"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
// Role enum zod compatible হিসাবে
const roleEnum = zod_1.z.nativeEnum(user_interface_1.Role);
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long."),
    email: zod_1.z.string().email("Invalid email format."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long."),
    role: roleEnum.default(user_interface_1.Role.CLIENT), // সঠিকভাবে default সেট ✔
    bio: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    location: zod_1.z.string().optional(),
    profilePicture: zod_1.z.string().url().optional(),
});
// Conditional Validation For SELLER
module.exports = {
    registerSchema: exports.registerSchema,
};
