import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg">
          Thanks for reaching out! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Your Name" className="w-full border rounded-lg px-4 py-2" />
          <input required type="email" placeholder="Your Email" className="w-full border rounded-lg px-4 py-2" />
          <textarea required placeholder="Message" rows="4" className="w-full border rounded-lg px-4 py-2" />
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
