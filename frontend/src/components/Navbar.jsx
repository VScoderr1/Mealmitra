import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-cream-100/95 backdrop-blur border-b border-steel-300/40 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
          <span className="w-7 h-7 rounded-full bg-turmeric-500 flex items-center justify-center text-xs">🍱</span>
          Meal<span className="text-masala-600">Mitra</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-ink/80">
          <Link to="/" className="hover:text-masala-600">Home</Link>
          <Link to="/plans" className="hover:text-masala-600">Tiffin Plans</Link>
          <Link to="/about" className="hover:text-masala-600">About</Link>
          <Link to="/contact" className="hover:text-masala-600">Contact</Link>

          {userInfo ? (
            <>
              {userInfo.role === "admin" ? (
                <Link to="/admin" className="hover:text-masala-600">Admin</Link>
              ) : (
                <Link to="/dashboard" className="hover:text-masala-600">Dashboard</Link>
              )}
              <span className="text-steel-300">|</span>
              <span className="text-steel-500">Hi, {userInfo.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-masala-600 text-cream-100 px-4 py-1.5 rounded-full hover:bg-masala-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-masala-600">Login</Link>
              <Link
                to="/signup"
                className="bg-turmeric-500 text-ink px-4 py-1.5 rounded-full hover:bg-turmeric-400 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;