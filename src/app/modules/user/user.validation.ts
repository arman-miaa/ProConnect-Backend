import { z } from "zod";
import { Role } from "./user.interface";

// Role enum zod compatible হিসাবে
const roleEnum = z.nativeEnum(Role);

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),

  email: z.string().email("Invalid email format."),

  password: z.string().min(6, "Password must be at least 6 characters long."),

  role: roleEnum.default(Role.CLIENT), // সঠিকভাবে default সেট ✔

  title: z.string().optional(),
  bio: z.string().optional(),

  skills: z.array(z.string()).optional(),

  address: z.string().optional(),
  phone: z
    .string()
    .optional()
    .default("")
    .refine((val) => val === "" || /^\+?[0-9]{7,15}$/.test(val), {
      message: "Invalid phone number",
    }),
  profilePicture: z.string().url().optional(),
});

  // Conditional Validation For SELLER
  

module.exports = {
  registerSchema,
};
