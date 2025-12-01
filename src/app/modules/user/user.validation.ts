import { z } from "zod";
import { Role } from "./user.interface";

// Role enum zod compatible হিসাবে
const roleEnum = z.nativeEnum(Role);

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long."),

    email: z.string().email("Invalid email format."),

    password: z.string().min(6, "Password must be at least 6 characters long."),

    role: roleEnum.default(Role.CLIENT), // সঠিকভাবে default সেট ✔

    bio: z.string().optional(),

    skills: z.array(z.string()).optional(),

    location: z.string().optional(),

    profilePicture: z.string().url().optional(),
  })

  // Conditional Validation For SELLER
  

module.exports = {
  registerSchema,
};
