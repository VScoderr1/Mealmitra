import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManagePlans from "./ManagePlans";
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers";

const tabs = [
  { path: "/admin/plans", label: "Tiffin Plans" },
  { path: "/admin/orders", label: "Orders" },
  { path: "/admin/users", label: "Users" },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              location.pathname === t.path ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Routes>
        <Route index element={<Navigate to="plans" replace />} />
        <Route path="plans" element={<ManagePlans />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="users" element={<ManageUsers />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
