import express from "express";
import {
  cancelOrder,
  createOrder,
  signatureVarify,
} from "./razorpay.controller.js";

const router = express.Router();

router.post("/order", createOrder);

router.post("/verify", signatureVarify);

router.post("/cancel-order/:paymentId", cancelOrder);

export default router;
