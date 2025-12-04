"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const service_interface_1 = require("./service.interface");
const serviceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    description: { type: String, required: true, trim: true, minlength: 20 },
    price: { type: Number, required: true, min: 1 },
    deliveryTime: { type: Number, required: true, min: 1, max: 60 },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    // 📸 পরিবর্তন: সিঙ্গেল ইমেজ URL
    image: { type: String, required: true, default: "" },
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: Object.values(service_interface_1.ServiceStatus),
        default: service_interface_1.ServiceStatus.LIVE,
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// ... ইনডেক্সিং লজিক অপরিবর্তিত ...
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
