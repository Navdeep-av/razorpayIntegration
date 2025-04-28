import mongoose from "mongoose";

export const connectDB = () => {
  console.log("Inside Connect DB");
  mongoose
    .connect(process.env.MONGOURI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};
