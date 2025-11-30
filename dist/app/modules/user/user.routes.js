"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequrest_1 = require("../../middlewares/validateRequrest");
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequrest_1.validateRequest)(user_validation_1.FinalRegistrationSchema), user_controller_1.UserControllers.createUser);
router.post("/create-admin", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), 
// validateRequest(AdminCreateSchema),
user_controller_1.UserControllers.createAdmin);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.PERSONAL), user_controller_1.UserControllers.getAllUsers);
exports.UserRoutes = router;
