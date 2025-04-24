import express from "express";
import "dotenv/config";
import RazorPay from "razorpay";
import crypto from "crypto";
import { error } from "console";
import { paymentSchemaModell } from "../databse/db.Module.js";

const router = express.Router();

const razorpayInstance = new RazorPay({
  key_id: process.env.RazorPAY_KeyID,
  key_secret: process.env.RazorPAY_SecretID,
});

router.post("/order", (req, res) => {
  console.log("Inside");

  const { amount } = req.body;
  console.log(amount);
  try {
    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log("Error in create an Razorpay order", error);
        return res.status(500).json({
          message: "Something went Wrong in to create an Razorpay Order",
        });
      }
      res.status(200).json({ data: order });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/verify", async (req, res) => {
  console.log("Verify", req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    // Create Sign
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RazorPAY_SecretID)
      .update(sign.toString())
      .digest("hex");

    // console.log(razorpay_signature === expectedSign);

    // Create isAuthentic
    const isAuthentic = expectedSign === razorpay_signature;
    console.log("IsAuth", isAuthentic);
    if (isAuthentic) {
      const payment = new paymentSchemaModell({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      await payment.save();
      res.json({
        message: "Payment Success",
      });
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});

router.get("/get-payment", (req, res) => {
  console.log("Inside Payemt");
  res.json("Payment Details");
});

export default router;
