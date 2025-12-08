"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequrest_1 = require("../../middlewares/validateRequrest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequrest_1.validateRequest)(user_validation_1.registerSchema), user_controller_1.UserControllers.createUser);
router.post("/create-admin", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), (0, validateRequrest_1.validateRequest)(user_validation_1.registerSchema), user_controller_1.UserControllers.createAdmin);
// Get all admins only
router.get("/all-admins", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), user_controller_1.UserControllers.getAllAdmins);
router.patch("/update-profile", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), multer_config_1.multerUpload.single("file"), (0, validateRequrest_1.validateRequest)(user_validation_1.updateUserSchema), user_controller_1.UserControllers.updateUser);
// Delete an admin
router.delete("/delete-admin/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.deleteAdmin);
router.patch("/admin/update-user/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.adminUpdateUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers);
exports.UserRoutes = router;
