"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const message_route_1 = require("../modules/utility-messages/message.route");
const service_routes_1 = require("../modules/service/service.routes");
const order_routes_1 = require("../modules/order/order.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const payment_route_1 = require("../modules/payment/payment.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/service",
        route: service_routes_1.ServiceRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/transaction",
        route: transaction_routes_1.TransactionRoutes,
    },
    {
        path: "/",
        route: message_route_1.MessageRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
