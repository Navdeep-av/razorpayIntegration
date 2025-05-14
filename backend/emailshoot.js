import "dotenv/config";
import nodemailer from "nodemailer";
import { mailOptions } from "./config/email.config.js";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.USERPASS,
  },
});

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Error ", error);
  } else {
    console.log("Eamil Sent", info.response);
  }
});
