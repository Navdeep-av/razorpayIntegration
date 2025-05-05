import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  createOrder,
  handleCancelOrder,
  handleCancelOrderByPhone,
  handlePaymentVerify,
} from "../services/razorpay.Services.js";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const RazorPayCheckOutV2 = () => {
  const [paymentID, setPaymentID] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [userID, setUserID] = useState("");
  const [showPhoneCancelButton, setshowPhoneCancelButton] = useState();

  const handlePayment = async () => {
    console.log("Inside Handle Payment");
    try {
      const response = await createOrder(30000);

      verifyPayment(response.data);
    } catch (err) {
      console.log("error in creating order", err);
    }
  };

  const verifyPayment = async (data) => {
    console.log("id", data.data.id);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.data.amount,
      currency: data.data.currency,
      name: "Razor Pay",
      description: "Test Mode",
      order_id: data.data.id,
      handler: async (response) => {
        console.log("response", response);
        setPaymentID(response.razorpay_payment_id);
        try {
          const res = await handlePaymentVerify(response);

          console.log("Res", res);
          setUserID(res.data.data._id);
          if (res.status === 200) {
            setIsPlaying(!isPlaying);
          }
          if (res.message) {
            console.log("Res Message", res.message);
          }
        } catch (error) {
          console.log("ERR on 44", error);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  console.log("Isplaying", isPlaying);

  const cancelOrder = async () => {
    setIsPlaying(!isPlaying);
    try {
      const res = await handleCancelOrder(paymentID);
      console.log("ResForRefund", res);
      toast("Refund Intiated");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const cancelOrderByPhone = async () => {
    try {
      const res = await handleCancelOrderByPhone(userID, paymentID);
      console.log("ResForRefund", res);
      toast("Refund Intiate");
      setshowPhoneCancelButton(!showPhoneCancelButton);
      console.log(res);
    } catch (err) {
      console.log("Error", err);
    }
  };
  console.log("Userid", userID);
  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
      {isPlaying && (
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={10}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            setIsPlaying(!isPlaying);
            setshowPhoneCancelButton(!showPhoneCancelButton);
            // repeat animation in 1.5 seconds
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      )}

      {isPlaying && <button onClick={cancelOrder}>Cancel Order</button>}
      <ToastContainer />
      {showPhoneCancelButton && (
        <button onClick={cancelOrderByPhone}>Cancel Order By Phone</button>
      )}
    </div>
  );
};

export default RazorPayCheckOutV2;
