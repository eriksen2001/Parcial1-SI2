import { useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RGMe92ZyXz9G2acH3XV4V0JKaIRtljnePgyuUz23s9MndwOvjFsFJHWw3MwL7jA1KlL7wgqf22uFGRDCwbDeBuQ00SDnbCcHt"
); // tu clave pública

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [status, setStatus] = useState("esperando");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/crear-payment-intent/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

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
      console.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setStatus("exito");
    }

    setLoading(false);
  };

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <h4 className="mb-3">💳 Completa tu pago</h4>

      <form onSubmit={handleSubmit}>
        <div className="p-3 bg-light border rounded mb-3">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={!stripe || loading}
        >
          {loading ? "Procesando..." : `Pagar Bs ${amount}`}
        </button>
      </form>

      {status === "exito" && (
        <div className="alert alert-success mt-3">
          ✅ ¡Pago realizado con éxito!
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-danger mt-3">
          ❌ Hubo un error al procesar el pago.
        </div>
      )}
    </div>
  );
};

const StripeCheckout = ({ amount }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} />
  </Elements>
);

export default StripeCheckout;
