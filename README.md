# FourBite

A full-stack food ordering web application built as a final project for the Web Programming course. It consists of a customer-facing storefront, an admin panel, and a REST API backend — each deployed as a separate service.

Live URLs:
- Customer site: https://ikroma.store
- Admin panel: https://fourbite-admin.onrender.com  
- Backend API: https://fourbite-backend.onrender.com

---

## Tech Stack

**Backend** — Node.js, Express v5, MongoDB Atlas, Mongoose, JWT, Bcrypt, Cloudinary, Multer, Stripe

**Frontend & Admin** — React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Framer Motion

---

## Architecture

The system follows a typical three-tier architecture. The frontend and admin panel are static React apps that communicate with the backend over HTTP. The backend handles all business logic, talks to MongoDB for persistent data, Cloudinary for image storage, and Stripe for payment processing.

```
Customer Browser          Admin Browser
      |                        |
      |  HTTPS requests        |  HTTPS requests
      v                        v
+------------------Express REST API------------------+
|                                                    |
|   /api/user         /api/items      /api/orders    |
|   /api/cart                                        |
|                                                    |
|   Auth Middleware (JWT)                            |
+----+--------------------+-------------------+------+
     |                    |                   |
     v                    v                   v
MongoDB Atlas        Cloudinary           Stripe API
(Users, Items,      (Menu images)       (Checkout sessions,
 Cart, Orders)                           Payment confirmation)
```

When an admin uploads a menu item, the image goes directly to Cloudinary via Multer. The returned Cloudinary URL is stored in MongoDB. The frontend simply renders that URL — no images are stored on the server.

For online payments, the backend creates a Stripe Checkout session and returns the redirect URL to the frontend. After payment, Stripe redirects the user back to the app where the frontend calls a confirmation endpoint to update the order status.

---

## Project Structure

```
project_sister/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── itemController.js
│   │   ├── orderController.js     # Stripe integration lives here
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── modals/
│   │   ├── cartModal.js
│   │   ├── itemModal.js
│   │   ├── orderModal.js
│   │   └── userModal.js
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── itemRoute.js           # Cloudinary upload configured here
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── cartContext/           # Global cart state via Context API
│       ├── components/
│       │   ├── Banner/
│       │   ├── Navbar/
│       │   ├── OurMenu/
│       │   ├── OurHomeMenu/
│       │   ├── SpecialOffer/
│       │   ├── Checkout/
│       │   ├── CartPage/
│       │   ├── MyOrder/
│       │   ├── Login/
│       │   ├── SignUp/
│       │   ├── PrivateRoute/      # Route guard for authenticated pages
│       │   ├── Footer/
│       │   └── ...
│       ├── pages/
│       │   ├── Home/
│       │   ├── Menu/
│       │   ├── Cart/
│       │   ├── CheckoutPage/
│       │   ├── MyOrderPage/
│       │   ├── VerifyPaymentPage/
│       │   ├── AboutPage/
│       │   └── ContactPage/
│       └── App.jsx
│
├── admin/
│   └── src/
│       └── components/
│           ├── AddItem.jsx        # Menu upload form
│           ├── List.jsx           # Menu list with delete
│           ├── Order.jsx          # Order management
│           └── Navbar.jsx
│
└── package.json
```

---

## Features

**Customer**
- Browse menu by category
- Add items to cart (persisted via Context API)
- Checkout with delivery address form
- Pay via Cash on Delivery or online through Stripe
- View order history and live status updates

**Admin**
- Upload new menu items with image (stored on Cloudinary)
- Delete menu items
- View all incoming orders
- Update order status: Processing > Out for Delivery > Delivered

---

## API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/user/register | Register a new user | No |
| POST | /api/user/login | Login and receive JWT | No |
| GET | /api/items | Get all menu items | No |
| POST | /api/items | Add a menu item with image | No |
| DELETE | /api/items/:id | Delete a menu item | No |
| GET | /api/cart | Get current user's cart | JWT |
| POST | /api/cart | Add item to cart | JWT |
| POST | /api/orders | Place an order | JWT |
| GET | /api/orders | Get user's order history | JWT |
| GET | /api/orders/confirm | Confirm Stripe payment | JWT |
| GET | /api/orders/:id | Get single order | JWT |
| GET | /api/orders/getall | Get all orders (admin) | No |
| PUT | /api/orders/getall/:id | Update any order (admin) | No |

---

## Getting Started

Prerequisites: Node.js v18+, a MongoDB Atlas cluster, and a Cloudinary account.

```bash
git clone <repo-url>
cd project_sister

# Install dependencies for each service
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

Create `backend/.env`:

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_atlas_uri
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_xxx
```

Run each service in a separate terminal:

```bash
cd backend && npm start        # http://localhost:4000
cd frontend && npm run dev     # http://localhost:5173
cd admin && npm run dev        # http://localhost:5174
```

---

## Deployment Notes

The project runs on three separate Render services (two static sites, one Node.js web service). Because Render's filesystem is ephemeral, all uploaded images are stored on Cloudinary rather than the server. Add all environment variables from `.env` to the Render dashboard under the backend service settings before deploying.

---

## What I Learned

Building this project from scratch covered a range of concepts that are common in real-world applications.

**Authentication flow** — implementing JWT-based auth from token generation on login to middleware verification on protected routes, with token sent via Authorization header.

**Image handling in production** — the difference between local disk storage (which breaks on ephemeral servers) and cloud storage. Switching from Multer's disk storage to Cloudinary using `multer-storage-cloudinary` solved the issue of images disappearing on every Render redeploy.

**Stripe payment integration** — creating Checkout Sessions server-side, redirecting the user to Stripe's hosted page, then confirming the payment status on return via session ID lookup.

**Multi-service architecture** — managing three separate deployments (backend, frontend, admin) with environment-specific base URLs and CORS configuration that accounts for all allowed origins.

**MongoDB schema design** — modeling nested data like order items and embedding subdocuments versus referencing, and using Mongoose indexes for fields that are frequently queried (payment status, order status, user ID).

---

## License

MIT License

Copyright (c) 2026 Ikroma Hataf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
