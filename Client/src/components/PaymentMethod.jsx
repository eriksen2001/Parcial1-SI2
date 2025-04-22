// src/components/PaymentMethod.jsx
import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Cargar clave pública desde el .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ carrito }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [metodo, setMetodo] = useState("tarjeta");
  const [descuento, setDescuento] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("esperando");

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const total = calcularTotal();
  const envio = metodo === "tarjeta" ? 10 : 0;
  const montoDescuento = total * (descuento / 100);
  const totalFinal = total - montoDescuento + envio;

  useEffect(() => {
    if (metodo === "tarjeta" && totalFinal > 0) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/products/payment-intent/`, {
          amount: totalFinal,
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) =>
          console.error("❌ Error al generar clientSecret:", err)
        );
    }
  }, [totalFinal, metodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setStatus("error");
    } else if (result.paymentIntent.status === "succeeded") {
      setStatus("exito");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row g-4">
        {/* MÉTODOS DE PAGO */}
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-4">Método de Pago</h4>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="tarjeta"
                value="tarjeta"
                checked={metodo === "tarjeta"}
                onChange={() => setMetodo("tarjeta")}
              />
              <label className="form-check-label" htmlFor="tarjeta">
                💳 Tarjeta de Crédito/Débito
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="efectivo"
                value="efectivo"
                checked={metodo === "efectivo"}
                onChange={() => setMetodo("efectivo")}
              />
              <label className="form-check-label" htmlFor="efectivo">
                💵 Pago en Efectivo
              </label>
            </div>

            <div className="mt-4">
              {metodo === "tarjeta" ? (
                <form onSubmit={handleSubmit}>
                  <div className="p-3 bg-light border rounded mb-3">
                    <CardElement
                      options={{ style: { base: { fontSize: "16px" } } }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={!stripe || loading}
                  >
                    {loading
                      ? "Procesando..."
                      : `Pagar Bs ${totalFinal.toFixed(2)}`}
                  </button>
                  {status === "exito" && (
                    <div className="alert alert-success mt-3">
                      ✅ ¡Pago exitoso!
                    </div>
                  )}
                  {status === "error" && (
                    <div className="alert alert-danger mt-3">
                      ❌ Error en el pago.
                    </div>
                  )}
                </form>
              ) : (
                <div className="alert alert-info">
                  Presentarse en caja con su código de pedido. Total a pagar:{" "}
                  <strong>Bs {totalFinal.toFixed(2)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESUMEN DE COMPRA */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm bg-light">
            <h5 className="mb-3">Resumen de Compra</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal</span>
                <span>Bs {total.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <label htmlFor="descuentoInput" className="mb-0">
                  Descuento (%)
                </label>
                <input
                  id="descuentoInput"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="form-control form-control-sm w-50 text-end"
                  value={descuento}
                  onChange={(e) =>
                    setDescuento(parseFloat(e.target.value) || 0)
                  }
                />
              </li>
              <li className="list-group-item d-flex justify-content-between text-danger">
                <span>Descuento aplicado:</span>
                <span>- Bs {montoDescuento.toFixed(2)}</span>
              </li>
              {envio > 0 && (
                <li className="list-group-item d-flex justify-content-between">
                  <span>Envío</span>
                  <span>Bs {envio.toFixed(2)}</span>
                </li>
              )}
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>Bs {totalFinal.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedPayment = ({ carrito }) => (
  <Elements stripe={stripePromise}>
    <PaymentForm carrito={carrito} />
  </Elements>
);

export default WrappedPayment;
