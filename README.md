# MealMitra – Tiffin Ordering Platform

A full-stack MERN (MongoDB, Express, React, Node.js) tiffin subscription ordering
platform, built to match the 4-week project scope: authentication, tiffin plan
ordering (Breakfast/Lunch/Dinner), subscription durations (Daily/Weekly/Monthly),
online payments, email notifications, an admin dashboard, and an AI meal
recommendation chatbot.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcrypt,
  Razorpay (payments), Nodemailer (emails), Helmet + rate limiting (security)
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios

## Project Structure

```
mealmitra/
  backend/     -> Express API server
  frontend/    -> React (Vite) client
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a free MongoDB Atlas cluster)
- (Optional) Razorpay test account, Gmail app password, Gemini API key —
  the app works fully without these, using built-in mock/fallback modes.

## 1. Backend Setup

```bash
cd backend
npm install
```

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Key variables in `.env`:
- `MONGO_URI` – your MongoDB connection string (defaults to local MongoDB)
- `JWT_SECRET` – any long random string
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` – optional; leave blank to use the
  built-in mock payment flow (fully functional for demos, no real money moves)
- `EMAIL_USER` / `EMAIL_PASS` – optional Gmail SMTP creds (use an "App Password");
  leave blank and emails are simply logged to the console instead
- `GEMINI_API_KEY` – optional; leave blank to use the built-in rule-based chatbot

Seed the database with a sample admin account and sample tiffin plans:

```bash
npm run seed
```

This creates:
- Admin login: `admin@mealmitra.com` / `Admin@12345` (or whatever you set in `.env`)
- 9 sample tiffin plans (Breakfast/Lunch/Dinner × Daily/Weekly/Monthly)

Start the backend server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

## 3. Using the App

- **As a customer:** Sign up, browse Tiffin Plans, place an order, and pay
  (mock payment works instantly if Razorpay isn't configured). Check "My Orders"
  in your dashboard. Try the chat bubble in the bottom-right for meal suggestions
  (e.g. "Budget 2000/month, need lunch and dinner").
- **As admin:** Log in with the seeded admin account, go to the "Admin" link in
  the navbar to add/edit/delete tiffin plans, view all orders and update their
  status (Pending → Confirmed → Delivered), and manage users.

## Features Implemented

- JWT authentication with bcrypt password hashing
- Role-based access (user / admin) with protected routes on both frontend and backend
- Tiffin plan CRUD (admin) and browsing/filtering (user)
- Order creation with delivery address and subscription duration
- Payment flow: real Razorpay checkout if keys are configured, otherwise an
  automatic mock-payment flow so the whole purchase journey still works end-to-end
- Order status tracking (Pending/Confirmed/Delivered/Cancelled) with email
  notifications on registration, payment success, and delivery
- Admin dashboard: manage plans, view/update all orders, manage users
- AI chatbot: rule-based budget/meal-type recommendation engine built in, with
  an optional Gemini API integration for more natural replies if a key is provided
- Security: Helmet, rate limiting, input validation (express-validator)

## Notes for Submission

- If you don't want to set up MongoDB Atlas, install MongoDB Community Server
  locally and the default `MONGO_URI` in `.env.example` will work as-is.
- Everything works without any paid API keys (Razorpay/Gemini/Email) thanks to
  the built-in mock/fallback modes — good for a live demo or grading without
  needing real credentials.
- To deploy: frontend → Vercel/Netlify, backend → Render/Railway, database →
  MongoDB Atlas. Update `CLIENT_URL` (backend) and `VITE_API_URL` (frontend)
  to point to the deployed URLs.
