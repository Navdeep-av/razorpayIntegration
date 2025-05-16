import express from "express";
import {
  cancelOrder,
  cancelOrderByPhoneV2,
  createOrder,
  fetchOrderStatus,
  signatureVarify,
  updateOrderStatus,
} from "../../../../services/payments/razorpay/razorpay.service.js";

const router = express.Router();

router.post("/order", createOrder);

router.post("/verify", signatureVarify);

router.post("/cancel-order/:paymentId", cancelOrder);

router.post("/cancel-order/:userId/:paymentId", cancelOrderByPhoneV2);

router.post("/update-order-status/", updateOrderStatus);

router.get("/order-status/:orderId", fetchOrderStatus);

export default router;
