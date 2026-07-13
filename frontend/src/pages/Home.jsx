import { Link } from "react-router-dom";
import { FOOD_IMAGES } from "../assets/foodImages";

const mealCards = [
  {
    mealType: "Breakfast",
    title: "Breakfast Plans",
    text: "Start the day with a warm, homely plate before the world asks anything of you.",
  },
  {
    mealType: "Lunch",
    title: "Lunch Plans",
    text: "A proper thali at your desk, delivered on time, so you don't skip the meal that matters most.",
  },
  {
    mealType: "Dinner",
    title: "Dinner Plans",
    text: "Light, home-style dinners that let you close the day without turning on the stove.",
  },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={FOOD_IMAGES.hero}
          alt="A home-style Indian meal spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-28 md:py-36 text-center">
        <p className="font-mono-label text-turmeric-400 text-xs uppercase tracking-widest mb-4">
          Breakfast &middot; Lunch &middot; Dinner, on your schedule
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-cream-100 leading-tight mb-6">
          Homely tiffins,<br className="hidden md:block" /> delivered like family made them.
        </h1>
        <p className="text-cream-100/90 text-lg max-w-xl mx-auto mb-10">
          Pick a plan, choose how often, and let the dabba do the rest &mdash; daily,
          weekly, or monthly, however your week actually looks.
        </p>
        <Link
          to="/plans"
          className="inline-block bg-turmeric-500 text-ink font-semibold px-8 py-3 rounded-full hover:bg-turmeric-400 transition shadow-lg shadow-black/20"
        >
          Browse Tiffin Plans
        </Link>
      </div>
    </section>

    <div className="steam-divider" />

    {/* Meal type cards with real photography */}
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="font-mono-label text-masala-600 text-xs uppercase tracking-widest mb-2">Three meals, one dabba</p>
        <h2 className="font-display text-3xl font-semibold text-ink">Choose what your day needs</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {mealCards.map((card) => (
          <Link
            key={card.mealType}
            to={`/plans?mealType=${card.mealType}`}
            className="group block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={FOOD_IMAGES[card.mealType]}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-6">
              <span className="font-mono-label text-xs text-masala-600 uppercase">{card.mealType}</span>
              <h3 className="font-display text-xl font-semibold mt-1 mb-2">{card.title}</h3>
              <p className="text-steel-500">{card.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* Chatbot callout */}
    <section className="bg-leaf-700 text-cream-100 py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono-label text-turmeric-400 text-xs uppercase tracking-widest mb-3">Not sure where to start?</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
          Tell our assistant your budget, it'll pick the plan.
        </h2>
        <p className="text-cream-100/80">
          Tap the chat bubble in the corner and say something like "budget 2000 a month,
          need lunch and dinner" &mdash; it'll do the math and suggest a plan on the spot.
        </p>
      </div>
    </section>
  </div>
);

export default Home;