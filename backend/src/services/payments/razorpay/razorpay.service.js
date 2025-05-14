import "dotenv/config";
import RazorPay from "razorpay";
import crypto from "crypto";

import { paymentSchemaModell } from "../../../../databse/razorpay.Db.Module.js";

import { sendEmail } from "../../../../emailShootC2.js";

const razorpayInstance = new RazorPay({
  key_id: process.env.RazorPAY_KeyID,
  key_secret: process.env.RazorPAY_SecretID,
});

const createOrder = async (req, res) => {
  console.log("Inside");

  const { amount } = req.body;

  console.log(amount);
  try {
    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    console.log("Options", options);
    razorpayInstance.orders.create(options, (error, order) => {
      console.log("Options 2", options);
      console.log("Order", order);
      console.log("Key", process.env.RazorPAY_KeyID);
      console.log("key_secret", process.env.RazorPAY_SecretID);
      if (error) {
        console.log("Error in create an Razorpay order", error);
        return res.status(500).json({
          message: "Something went Wrong in to create an Razorpay Order",
        });
      }

      console.log("Order", order);
      res.status(200).json({ data: order });
    });
  } catch (err) {
    console.log(err);
  }
};

const signatureVarify = async (req, res) => {
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
      const savePaymentInfo = new paymentSchemaModell({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      await savePaymentInfo.save();
      sendEmail({
        to: "ndeepgupta@gmail.com",
        subject: `New Order Placed ${razorpay_order_id} OAuth`,
        text: `Order has been successfully Placed, Order ID - ${razorpay_order_id}, Payment ID -  - ${razorpay_payment_id}`,
        from: process.env.USEREMAIL,
      });

      res.status(200).json({
        message: "Payment Success",
        data: savePaymentInfo,
      });
    } else {
      res.status(404).json({ message: "Unauthorized User" });
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const cancelOrder = async (req, res) => {
  const { paymentId } = req.params;

  console.log("PaymentID", paymentId);
  const findOrder = await paymentSchemaModell.findOne({
    razorpay_payment_id: paymentId,
  });
  const timeDiff = (Date.now() - findOrder.createdAt) / 1000;
  console.log("Time", timeDiff);
  if (timeDiff > 60) {
    return res.status(400).json({ message: "Cannot cancel after 1 minute" });
  } else {
    await paymentSchemaModell.updateOne(
      { razorpay_payment_id: paymentId },
      {
        $set: {
          status: "Order Canceled",
          cancellationReason: "Cancel by User in One minute",
        },
      }
    );
    const refund = await razorpayInstance.payments.refund(paymentId);
    console.log("refund", refund);

    sendEmail({
      to: "ndeepgupta@gmail.com",
      subject: `Order Canceled OAuth`,
      text: `Your Order has been Canceled  Under 60 sec, Refund Initiated, Payment ID -- ${paymentId}`,
    });

    res.json({
      message: "Order Canceled Under 60 sec, Refund Initiated",
      refund,
    });
  }
};

const cancelOrderByPhoneV2 = async (req, res) => {
  const { userId, paymentId } = req.params;
  console.log(userId, paymentId);

  const findOrder = await paymentSchemaModell.findOne({
    razorpay_payment_id: paymentId,
    _id: userId,
  });

  if (findOrder.status === "paid") {
    if (findOrder.OrderStatus === "Not-Accepted") {
      await paymentSchemaModell.updateOne(
        { razorpay_payment_id: paymentId },
        {
          $set: {
            status: "Order Canceled",
            cancellationReason: "Cancel by User via Phone Call",
          },
        }
      );
      const refund = await razorpayInstance.payments.refund(paymentId);
      console.log("refund", refund);

      sendEmail({
        to: "ndeepgupta@gmail.com",
        subject: `Order Canceled By Phone OAuth`,
        text: `Your Order has been Canceled via phone call, Refund Initiated, Payment ID -- ${paymentId}`,
      });

      res.json({
        message: "Order Canceled, Refund Initiated",
        refund,
      });
    } else if (findOrder.OrderStatus === "Accepted") {
      console.log("Inside Accepted");
      res.json({
        message:
          "The refund cannot be initiated as the order is currently being processed.",
      });
    }
  } else {
    res.json({ message: "Refund Already Initiated" });
  }
  console.log("FindOrder", findOrder);
};

// Update Order Status from Backend
const updateOrderStatus = async (req, res) => {
  console.log("inside Statys");
  const { paymentId } = req.body;

  console.log("PaymentID", paymentId);

  const findOrder = await paymentSchemaModell.findOne({
    razorpay_payment_id: paymentId,
  });

  if (findOrder.OrderStatus === "Not-Accepted" && findOrder.status === "paid") {
    await paymentSchemaModell.updateOne(
      { razorpay_payment_id: paymentId },
      {
        $set: {
          OrderStatus: "Accepted",
        },
      }
    );
    res.json("Order Being Started/Processing");
  } else {
    res.json("Can not update the Order Status for Some reason");
  }
};

export {
  createOrder,
  signatureVarify,
  cancelOrder,
  updateOrderStatus,
  cancelOrderByPhoneV2,
};
