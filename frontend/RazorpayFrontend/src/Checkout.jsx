import axios from "axios";

const RazorPayCheckOut = () => {
  const handlePayment = async () => {
    console.log("Inside Hanfle Payment");
    try {
      const response = await axios.post(
        "http://localhost:5800/api/payment/order",
        {
          amount: 5000,
        }
      );
      console.log(response);
      handlePaymentVerify(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentVerify = async (data) => {
    console.log("id", data.data.id);
    const options = {
      key: "rzp_test_xH6oqyY9MSoqj8",
      amount: data.data.amount,
      currency: data.data.currency,
      name: "Razor Pay",
      description: "Test Mode",
      order_id: data.data.id,
      handler: async (response) => {
        console.log("response", response);
        try {
          const res = await axios.post(
            "http://localhost:5800/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );
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

export default RazorPayCheckOut;
