import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(({ data }) => setOrder(data));
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        Your order {order ? `for ${order.mealType} (${order.duration})` : ""} has been confirmed.
        A confirmation email has been sent to your registered email address.
      </p>
      <Link
        to="/dashboard"
        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default PaymentSuccess;
