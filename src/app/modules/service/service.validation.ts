import { z } from "zod";
import { ServiceStatus, ServiceCategory } from "./service.interface"; // ServiceCategory যোগ করুন

const serviceStatusEnum = z.nativeEnum(ServiceStatus);
const serviceCategoryEnum = z.nativeEnum(ServiceCategory); // 💡 নতুন ক্যাটাগরি এনুম যোগ করা হলো

// 🛑 দ্রষ্টব্য: form-data থেকে আসা সমস্ত মান (Value) স্ট্রিং হয়।
// তাই Zod transform ব্যবহার করে সেগুলোকে number বা array তে রূপান্তর করতে হবে।

// =========================================================================
// 1. সার্ভিস তৈরি (POST)
// =========================================================================
export const createServiceSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(100),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long."),

  price: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val)) // এটি সবসময় সংখ্যায় রূপান্তর করবে
    .refine(
      (val) => !isNaN(val) && val >= 1,
      "Price must be a positive number."
    ),

  // 💡 ফিক্স: deliveryTime - এখন string OR number গ্রহণ করবে।
  deliveryTime: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val)) // এটি সবসময় সংখ্যায় রূপান্তর করবে
    .refine(
      (val) => !isNaN(val) && Number.isInteger(val) && val >= 1,
      "Delivery time must be an integer of at least 1 day."
    ),

  category: serviceCategoryEnum,

  // 💡 ফিক্স: tags - এখন string OR array গ্রহণ করবে।
  tags: z
    .union([z.array(z.string()), z.string()])
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
export const updateServiceSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().min(20).optional(),

    // 💡 ফিক্স: string থেকে number এ রূপান্তর
    price: z
      .string()
      .transform((val) => Number(val))
      .refine(
        (val) => !isNaN(val) && val >= 1,
        "Price must be a positive number."
      )
      .optional(),

    // 💡 ফিক্স: string থেকে number/int এ রূপান্তর
    deliveryTime: z
      .string()
      .transform((val) => Number(val))
      .refine(
        (val) => !isNaN(val) && Number.isInteger(val) && val >= 1,
        "Delivery time must be an integer of at least 1 day."
      )
      .optional(),

    // 💡 ফিক্স: অনুমোদিত ক্যাটাগরি এনুম ব্যবহার করা
    category: serviceCategoryEnum.optional(),

    // 💡 ফিক্স: কমা-সেপারেটেড স্ট্রিং থেকে array of string এ রূপান্তর
    tags: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return [];
        return val
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }),

    status: serviceStatusEnum.optional(),
    // profileImage: z.string().url("Invalid image URL format").optional(),
  }),
});
