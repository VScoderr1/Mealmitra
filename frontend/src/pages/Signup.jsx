import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-md">
        <input required name="name" placeholder="Full Name" onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        <input required type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        <input required type="password" name="password" placeholder="Password (min 6 chars)" onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        <input name="phone" placeholder="Phone (optional)" onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        <input name="address" placeholder="Address (optional)" onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        <button
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
