import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FOOD_IMAGES } from "../assets/foodImages";

const mealTypes = [
  { value: "Breakfast", text: "Start the day right" },
  { value: "Lunch", text: "A proper midday thali" },
  { value: "Dinner", text: "Light and easy evenings" },
];

const durations = [
  { value: "Daily", text: "Try it out, one day at a time" },
  { value: "Weekly", text: "A week of sorted meals" },
  { value: "Monthly", text: "Best value, set and forget" },
];

const Plans = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mealType = searchParams.get("mealType") || "";
  const duration = searchParams.get("duration") || "";

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mealType || !duration) return;
    setLoading(true);
    api.get(`/plans?mealType=${mealType}`).then(({ data }) => {
      setPlans(data.filter((p) => p.duration === duration));
      setLoading(false);
    });
  }, [mealType, duration]);

  const chooseMealType = (value) => setSearchParams({ mealType: value });
  const chooseDuration = (value) => setSearchParams({ mealType, duration: value });
  const reset = () => setSearchParams({});
  const changeMealType = () => setSearchParams({});
  const changeDuration = () => setSearchParams({ mealType });

  const handleOrder = (plan) => {
    if (!userInfo) return navigate("/login");
    navigate(`/order/${plan._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="font-mono-label text-masala-600 text-xs uppercase tracking-widest mb-2">Pick your plan</p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Tiffin Plans</h1>

      {/* Breadcrumb / step trail */}
      <div className="flex items-center gap-2 text-sm text-steel-500 mb-8">
        <button onClick={reset} className={`hover:text-masala-600 ${!mealType ? "font-semibold text-ink" : ""}`}>
          1. Meal
        </button>
        <span>›</span>
        <button
          onClick={mealType ? changeDuration : undefined}
          disabled={!mealType}
          className={`hover:text-masala-600 disabled:hover:text-steel-500 disabled:cursor-not-allowed ${mealType && !duration ? "font-semibold text-ink" : ""}`}
        >
          2. Duration
        </button>
        <span>›</span>
        <span className={duration ? "font-semibold text-ink" : ""}>3. Plan</span>
      </div>

      {/* Step 1: choose meal type */}
      {!mealType && (
        <div className="grid md:grid-cols-3 gap-6">
          {mealTypes.map((m) => (
            <button
              key={m.value}
              onClick={() => chooseMealType(m.value)}
              className="text-left bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group"
            >
              <div className="h-40 overflow-hidden">
                <img src={FOOD_IMAGES[m.value]} alt={m.value} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold mb-1">{m.value}</h3>
                <p className="text-steel-500 text-sm">{m.text}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: choose duration */}
      {mealType && !duration && (
        <div>
          <button onClick={changeMealType} className="text-sm text-masala-600 mb-6 hover:underline">
            ← Change meal type ({mealType})
          </button>
          <div className="grid md:grid-cols-3 gap-6">
            {durations.map((d) => (
              <button
                key={d.value}
                onClick={() => chooseDuration(d.value)}
                className="text-left bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition border border-transparent hover:border-turmeric-500"
              >
                <h3 className="font-display text-xl font-semibold mb-1">{d.value}</h3>
                <p className="text-steel-500 text-sm">{d.text}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: show matching plan(s) */}
      {mealType && duration && (
        <div>
          <button onClick={changeDuration} className="text-sm text-masala-600 mb-6 hover:underline">
            ← Change duration ({mealType} · {duration})
          </button>

          {loading ? (
            <p>Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-steel-500">
              No {duration.toLowerCase()} {mealType.toLowerCase()} plan available yet. If you're the admin, add one from the Admin Dashboard.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan._id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                  <div className="h-40 overflow-hidden">
                    <img src={FOOD_IMAGES[plan.mealType]} alt={plan.mealType} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="font-mono-label text-xs text-masala-600 uppercase mb-1">
                      {plan.mealType} &middot; {plan.duration}
                    </span>
                    <h3 className="font-display text-xl font-semibold mb-2">{plan.title}</h3>
                    <p className="text-steel-500 flex-1 mb-4">{plan.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-2xl font-semibold text-ink">₹{plan.price}</span>
                      <button
                        onClick={() => handleOrder(plan)}
                        className="bg-turmeric-500 text-ink px-4 py-2 rounded-full hover:bg-turmeric-400 text-sm font-semibold transition"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Plans;