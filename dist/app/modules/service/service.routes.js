"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const service_controller_1 = require("./service.controller");
const service_validation_1 = require("./service.validation");
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequrest_1 = require("../../middlewares/validateRequrest");
// ⚠️ এখানে আপনার Multer/Cloudinary মিডলওয়্যার আমদানি করুন যদি ফাইল আপলোড ব্যবহার করেন
const router = express_1.default.Router();
// সেলার দ্বারা সার্ভিস পোস্ট
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), multer_config_1.multerUpload.single("file"), (0, validateRequrest_1.validateRequest)(service_validation_1.createServiceSchema), service_controller_1.ServiceControllers.createService);
// সমস্ত সার্ভিস দেখুন (ফিল্টারিং/সার্চিং সহ) - সবার জন্য উন্মুক্ত
router.get("/", service_controller_1.ServiceControllers.getAllServices);
// সেলার দ্বারা সার্ভিস আপডেট
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), multer_config_1.multerUpload.single("file"), (0, validateRequrest_1.validateRequest)(service_validation_1.updateServiceSchema), service_controller_1.ServiceControllers.updateService);
// সেলার দ্বারা সার্ভিস ডিলেট
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SELLER), service_controller_1.ServiceControllers.deleteService);
// একটি নির্দিষ্ট সার্ভিস দেখুন - সবার জন্য উন্মুক্ত
router.get("/:id", service_controller_1.ServiceControllers.getServiceById);
exports.ServiceRoutes = router;
