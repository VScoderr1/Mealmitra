import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-leaf-700 text-cream-100/80 mt-16">
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
      <div>
        <h3 className="font-display text-cream-100 text-lg font-semibold mb-2">MealMitra</h3>
        <p>Fresh, homely tiffins delivered to your doorstep — breakfast, lunch, and dinner plans made simple.</p>
      </div>
      <div>
        <h4 className="text-cream-100 font-semibold mb-2 font-mono-label text-xs uppercase tracking-widest">Quick Links</h4>
        <ul className="space-y-1">
          <li><Link to="/" className="hover:text-cream-100">Home</Link></li>
          <li><Link to="/plans" className="hover:text-cream-100">Tiffin Plans</Link></li>
          <li><Link to="/about" className="hover:text-cream-100">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-cream-100">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-cream-100 font-semibold mb-2 font-mono-label text-xs uppercase tracking-widest">Contact</h4>
        <p>support@mealmitra.com</p>
        <p>+91 98765 43210</p>
      </div>
    </div>
    <div className="text-center text-xs text-cream-100/50 pb-6">
      © {new Date().getFullYear()} MealMitra. All rights reserved.
    </div>
  </footer>
);

export default Footer;