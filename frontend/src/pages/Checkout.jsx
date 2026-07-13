import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: orderData } = await api.get(`/orders/${orderId}`);
      setOrder(orderData);
      const { data: payData } = await api.post("/payments/create", { orderId });
      setPaymentInfo(payData);
    };
    init();
  }, [orderId]);

  const handleRazorpayPay = async () => {
    setError("");
    setProcessing(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load Razorpay SDK. Check your internet connection.");
      setProcessing(false);
      return;
    }

    const options = {
      key: paymentInfo.keyId,
      amount: paymentInfo.amount,
      currency: paymentInfo.currency,
      name: "MealMitra",
      description: "Tiffin Plan Payment",
      order_id: paymentInfo.razorpayOrderId,
      handler: async (response) => {
        try {
          await api.post("/payments/verify", { orderId, ...response });
          navigate(`/payment-success/${orderId}`);
        } catch (err) {
          setError("Payment verification failed.");
        }
      },
      theme: { color: "#ea580c" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => setError("Payment failed. Please try again."));
    rzp.open();
    setProcessing(false);
  };

  const handleMockPay = async () => {
    setError("");
    setProcessing(true);
    try {
      await api.post("/payments/mock-confirm", { orderId });
      navigate(`/payment-success/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Payment could not be completed");
    } finally {
      setProcessing(false);
    }
  };

  if (!order || !paymentInfo) return <div className="max-w-xl mx-auto px-4 py-16">Loading checkout...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 space-y-2">
        <p><span className="font-medium">Meal Type:</span> {order.mealType}</p>
        <p><span className="font-medium">Duration:</span> {order.duration}</p>
        <p><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
        <p className="text-2xl font-bold pt-2">Amount: ₹{order.amount}</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {paymentInfo.mode === "mock" && (
  <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg mb-4">
    This order will be confirmed using a test payment flow.
  </div>
)}

      <button
        onClick={paymentInfo.mode === "razorpay" ? handleRazorpayPay : handleMockPay}
        disabled={processing}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay ₹${order.amount}`}
      </button>
    </div>
  );
};

export default Checkout;
