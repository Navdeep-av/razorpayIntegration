import {
  createOrder,
  handlePaymentVerify,
} from "../services/razorpay.Services.js";

const RazorPayCheckOutV2 = () => {
  const handlePayment = async () => {
    console.log("Inside Handle Payment");
    try {
      const response = await createOrder(300);
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
        try {
          const res = handlePaymentVerify(response);

          console.log("Res", res);
          if (res.message) {
            toast.success(verifyData.message);
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

  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default RazorPayCheckOutV2;
