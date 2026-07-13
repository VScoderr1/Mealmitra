const TiffinPlan = require("../models/TiffinPlan");

// Extract a rupee budget number and meal keywords from free text
const parseMessage = (message) => {
  const text = message.toLowerCase();
  const budgetMatch = text.match(/(\d{2,6})/);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;

  const meals = [];
  if (text.includes("breakfast")) meals.push("Breakfast");
  if (text.includes("lunch")) meals.push("Lunch");
  if (text.includes("dinner")) meals.push("Dinner");

  let duration = null;
  if (text.includes("month")) duration = "Monthly";
  else if (text.includes("week")) duration = "Weekly";
  else if (text.includes("day") || text.includes("daily")) duration = "Daily";

  return { budget, meals, duration };
};

// Built-in rule-based recommendation engine (no external API key needed)
const ruleBasedRecommendation = async ({ budget, meals, duration }) => {
  const filter = { isActive: true };
  if (meals.length) filter.mealType = { $in: meals };
  if (duration) filter.duration = duration;

  let plans = await TiffinPlan.find(filter).sort({ price: 1 });

  if (!plans.length) {
    plans = await TiffinPlan.find({ isActive: true }).sort({ price: 1 });
  }

  let withinBudget = plans;
  if (budget) {
    withinBudget = plans.filter((p) => p.price <= budget);
    if (!withinBudget.length) withinBudget = plans;
  }

  const suggestions = withinBudget.slice(0, 3);
  const totalCost = suggestions.reduce((sum, p) => sum + p.price, 0);

  let reply = "";
  if (!suggestions.length) {
    reply = "I couldn't find any matching tiffin plans right now. Please check back once the admin adds some plans!";
  } else {
    reply = `Here ${suggestions.length > 1 ? "are" : "is"} what I'd recommend`;
    if (meals.length) reply += ` for ${meals.join(" + ")}`;
    if (duration) reply += ` (${duration})`;
    if (budget) reply += ` within your budget of ₹${budget}`;
    reply += ":\n\n";
    suggestions.forEach((p, i) => {
      reply += `${i + 1}. ${p.title} - ${p.mealType}, ${p.duration} - ₹${p.price}\n`;
    });
    reply += `\nEstimated total: ₹${totalCost}`;
  }

  return { reply, suggestions };
};

// Optional: call Gemini API if GEMINI_API_KEY is set, for a more natural response
const callGemini = async (message, plansContext) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are MealMitra's friendly tiffin meal assistant. A user said: "${message}".
Available tiffin plans (JSON): ${JSON.stringify(plansContext)}.
Recommend the best matching plan(s) based on their budget and meal preferences, and give an estimated total cost. Keep the reply short and friendly.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("DEBUG - Gemini API error response:", JSON.stringify(data));
    throw new Error(data?.error?.message || `Gemini API returned status ${response.status}`);
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
};

// @desc  Chatbot meal suggestion endpoint
// @route POST /api/chatbot/message
const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const parsed = parseMessage(message);
    const { reply: ruleReply, suggestions } = await ruleBasedRecommendation(parsed);
    console.log("DEBUG - Gemini key loaded:", process.env.GEMINI_API_KEY ? `YES (length ${process.env.GEMINI_API_KEY.length})` : "NO - key is missing/empty");
    // Try Gemini for a more natural-language reply if configured; otherwise use rule-based reply
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiReply = await callGemini(message, suggestions);
        if (aiReply) {
          return res.json({ reply: aiReply, suggestions });
        }
      } catch (err) {
        console.log("Gemini call failed, falling back to rule-based reply:", err.message);
      }
    }

    res.json({ reply: ruleReply, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithBot };
