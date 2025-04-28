import express from "express";
import razorPayRouter from "./razorpay/razorpay.routes.js";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./databse/razorpay.db.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/payment", razorPayRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
