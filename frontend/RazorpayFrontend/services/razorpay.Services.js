import axios from "axios";

export const createOrder = async (amount) => {
  const response = await axios.post("http://localhost:5800/api/payment/order", {
    amount,
  });
  return response;
};

export const handlePaymentVerify = async (response) => {
  const res = await axios.post("http://localhost:5800/api/payment/verify", {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
  });

  return res;
};

export const handleCancelOrder = async (paymentID) => {
  const res = await axios.post(
    `http://localhost:5800/api/payment/cancel-order/${paymentID}`
  );
  return res;
};
