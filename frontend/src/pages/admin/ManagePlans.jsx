import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = { title: "", description: "", mealType: "Breakfast", duration: "Daily", price: "", isActive: true };

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    const { data } = await api.get("/plans/admin/all");
    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, form);
      } else {
        await api.post("/plans", form);
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save plan");
    }
  };

  const handleEdit = (plan) => {
    setForm({
      title: plan.title,
      description: plan.description,
      mealType: plan.mealType,
      duration: plan.duration,
      price: plan.price,
      isActive: plan.isActive,
    });
    setEditingId(plan._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await api.delete(`/plans/${id}`);
    fetchPlans();
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-3 md:col-span-1 h-fit">
        <h3 className="font-bold text-lg">{editingId ? "Edit Plan" : "Add New Plan"}</h3>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
        <input required name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded-lg px-3 py-2" />
        <textarea required name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded-lg px-3 py-2" />
        <select name="mealType" value={form.mealType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
        <select name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
        <input required type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (INR)" className="w-full border rounded-lg px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
        </label>
        <div className="flex gap-2">
          <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700">
            {editingId ? "Update" : "Add"} Plan
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 bg-gray-200 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="md:col-span-2 space-y-3">
        {plans.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-primary-600 uppercase">{p.mealType} • {p.duration}</span>
              <h4 className="font-bold">{p.title} - ₹{p.price}</h4>
              <p className="text-sm text-gray-500">{p.description}</p>
              {!p.isActive && <span className="text-xs text-red-500">Inactive</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-sm bg-gray-100 px-3 py-1 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlans;
