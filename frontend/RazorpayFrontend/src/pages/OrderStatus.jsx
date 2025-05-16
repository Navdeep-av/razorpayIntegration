import { useEffect } from "react";

import { useParams } from "react-router";
import { fetchOrderStatus } from "../services/razorpay.Services";

import { ToastContainer, toast } from "react-toastify";

const OrderStatus = () => {
  const { orderid } = useParams();

  useEffect(() => {
    const getOrderStatus = async () => {
      try {
        const res = await fetchOrderStatus(orderid);
        console.log("Res", res);
        console.log(res.data.message);
        toast(res.data.message);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong while fetching order status");
      }
    };
    getOrderStatus();
  }, [orderid]);

  return <ToastContainer />;
};

export default OrderStatus;
