import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "paid",
  },
  cancellationReason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const paymentSchemaModell = model("paymentSchemaData", paymentSchema);
