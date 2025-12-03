"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const router = (0, express_1.Router)();
router.post("/message", message_controller_1.MessageControllers.createMessage);
exports.MessageRoutes = router;
