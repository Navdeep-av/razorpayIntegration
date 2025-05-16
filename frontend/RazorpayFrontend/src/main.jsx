import { createBrowserRouter, RouterProvider } from "react-router";
import * as React from "react";

import * as ReactDOM from "react-dom/client";
import RazorPayCheckOutV2 from "./pages/Razorpay.Checkout.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RazorPayCheckOutV2 />,
  },
  {
    path: "/order-status/:orderid",
    element: <OrderStatus />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
