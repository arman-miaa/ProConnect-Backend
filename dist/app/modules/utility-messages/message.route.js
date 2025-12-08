"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/create-message", message_controller_1.MessageControllers.createMessage);
// Admin-only routes
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), message_controller_1.MessageControllers.getAllMessages);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), message_controller_1.MessageControllers.deleteMessage);
exports.MessageRoutes = router;
