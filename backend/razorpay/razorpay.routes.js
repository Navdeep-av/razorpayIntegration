import express from "express";
import { createOrder, signatureVarify } from "./razorpay.controller.js";

const router = express.Router();

router.post("/order", createOrder);

router.post("/verify", signatureVarify);

export default router;
