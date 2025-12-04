import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post(
  "/init-payment/:bookingId",
  checkAuth(Role.CLIENT),
  PaymentControllers.initPayment
);
router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentControllers.getInvoiceDownloadUrl
);
router.post("/validate-payment", PaymentControllers.validatePayment);
export const PaymentRoutes = router;
