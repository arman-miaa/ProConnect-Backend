import express from "express";
import { ServiceControllers } from "./service.controller";

import { createServiceSchema, updateServiceSchema } from "./service.validation";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequrest";
// ⚠️ এখানে আপনার Multer/Cloudinary মিডলওয়্যার আমদানি করুন যদি ফাইল আপলোড ব্যবহার করেন

const router = express.Router();

// সেলার দ্বারা সার্ভিস পোস্ট
router.post(
  "/",
  checkAuth(Role.SELLER),
  multerUpload.single("file"),
  validateRequest(createServiceSchema),
  ServiceControllers.createService
);

// সেলার দ্বারা সার্ভিস আপডেট
router.patch(
  "/:id",
  checkAuth(Role.SELLER),
  validateRequest(updateServiceSchema),
  ServiceControllers.updateService
);

// সেলার দ্বারা সার্ভিস ডিলেট
router.delete("/:id", checkAuth(Role.SELLER), ServiceControllers.deleteService);

// সমস্ত সার্ভিস দেখুন (ফিল্টারিং/সার্চিং সহ) - সবার জন্য উন্মুক্ত
router.get("/", ServiceControllers.getAllServices);

// একটি নির্দিষ্ট সার্ভিস দেখুন - সবার জন্য উন্মুক্ত
router.get("/:id", ServiceControllers.getServiceById);

export const ServiceRoutes = router;
