import express from "express";
import "dotenv/config";
import { connectDB } from "./databse/db.js";
import cors from "cors";
import payment from "./routes/payment.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/payment", payment);

app.get("/", (req, res) => {
  res.json({ msg: "Request Hit" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
