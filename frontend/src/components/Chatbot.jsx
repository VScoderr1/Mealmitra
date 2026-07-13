import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const suggestedPrompts = [
  "Budget 2000/month, need lunch and dinner",
  "Suggest a good breakfast plan",
  "Weekly plan under 600",
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm the MealMitra assistant. Tell me your budget and meal needs, and I'll suggest a plan for you." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const messageText = text ?? input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatbot/message", { message: messageText });
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process that right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 mb-3">
          <div className="bg-primary-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">MealMitra Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-primary-600 text-white ml-auto rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">Assistant is typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-100"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex border-t border-gray-200"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-primary-600 text-white px-4 text-sm font-medium">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary-600 text-white text-2xl shadow-xl flex items-center justify-center hover:bg-primary-700"
        aria-label="Open chat assistant"
      >
        💬
      </button>
    </div>
  );
};

export default Chatbot;
