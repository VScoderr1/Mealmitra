import { useEffect, useState } from "react";
import api from "../../api/axios";

const statuses = ["Pending", "Confirmed", "Delivered", "Cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, orderStatus) => {
    await api.put(`/orders/${id}/status`, { orderStatus });
    fetchOrders();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Meal</th>
            <th className="p-4">Duration</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Status</th>
            <th className="p-4">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-4">{o.userId?.name}<br /><span className="text-xs text-gray-400">{o.userId?.email}</span></td>
              <td className="p-4">{o.mealType}</td>
              <td className="p-4">{o.duration}</td>
              <td className="p-4">₹{o.amount}</td>
              <td className="p-4">{o.paymentStatus}</td>
              <td className="p-4">{o.orderStatus}</td>
              <td className="p-4">
                <select
                  value={o.orderStatus}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="p-4 text-gray-500">No orders yet.</p>}
    </div>
  );
};

export default ManageOrders;
