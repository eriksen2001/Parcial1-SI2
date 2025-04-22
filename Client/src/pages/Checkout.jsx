// src/pages/Checkout.jsx
import React from "react";
import WrappedPayment from "../components/PaymentMethod";

const Checkout = ({ carrito }) => {
  return <WrappedPayment carrito={carrito} />;
};

export default Checkout;
