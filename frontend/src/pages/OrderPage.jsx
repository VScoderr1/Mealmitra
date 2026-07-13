import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const OrderPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/plans/${planId}`).then(({ data }) => setPlan(data));
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!address.trim()) return setError("Please enter a delivery address");
    setLoading(true);
    try {
      const { data } = await api.post("/orders", { planId, deliveryAddress: address });
      navigate(`/checkout/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return <div className="max-w-xl mx-auto px-4 py-16">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Place Your Order</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <span className="text-xs font-semibold text-primary-600 uppercase">{plan.mealType} • {plan.duration}</span>
        <h3 className="text-xl font-bold">{plan.title}</h3>
        <p className="text-gray-600">{plan.description}</p>
        <p className="text-2xl font-bold mt-2">₹{plan.price}</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
        <textarea
          required
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full delivery address"
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
