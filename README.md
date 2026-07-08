# FourBite

FourBite is a full-stack food ordering web application. It has a customer-facing storefront, an admin panel, and an Express REST API backend. Each surface is designed to run as a separate service in production.

Live URLs:

- Customer site: https://ikroma.store
- Admin panel: https://admin.ikroma.store
- Backend API: https://fourbite-backend.onrender.com

---

## Tech Stack

**Backend**: Node.js, Express v5, MongoDB Atlas, Mongoose, JWT, bcrypt, cookie-parser, express-rate-limit, Cloudinary v2, Multer, Midtrans.

**Frontend and Admin**: React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Framer Motion.

---

## Architecture

FourBite uses a three-service web architecture. The customer frontend and admin panel are static React apps. Both communicate with the backend through HTTP APIs. The backend owns business logic, authentication, order processing, payment integration, media upload, and database access.

```text
Customer Browser          Admin Browser
      |                        |
      | HTTPS + cookies        | HTTPS + admin cookies
      v                        v
+------------------ Express REST API ------------------+
|                                                       |
| /api/user   /api/items   /api/cart   /api/orders     |
| /api/admin                                            |
|                                                       |
| JWT auth via httpOnly cookies                         |
| Rate limited login/register/admin-login routes        |
+---------+----------------+----------------+-----------+
          |                |                |
          v                v                v
   MongoDB Atlas      Cloudinary        Midtrans
   users, items,      menu images       Snap payment,
   cart, orders                         Core API status,
                                        webhook updates
```

The backend is the only service that talks directly to MongoDB, Cloudinary, and Midtrans. The frontend/admin never access those services directly except for the Midtrans Snap browser script used during online checkout.

---

## Current Payment Flow

FourBite currently uses **Midtrans**, not Stripe.

1. The customer selects `Online Payment` during checkout.
2. The frontend sends the order payload to `POST /api/orders`.
3. The backend validates the requested items against MongoDB and recalculates item price, tax, and total server-side.
4. The backend creates a Midtrans Snap transaction and stores the Snap token on the order.
5. The frontend opens the Midtrans Snap popup using the returned `snapToken`.
6. Midtrans can notify the backend through `POST /api/orders/midtrans-notification`.
7. The frontend can also check payment status through `GET /api/orders/payment-status/:orderId`.

Cash on Delivery is still supported. COD orders are saved directly with successful payment status, while online orders start as pending until Midtrans confirms the result.

---

## Image Upload Flow

Menu images are stored on Cloudinary.

1. The admin uploads an image from the admin panel.
2. The backend receives the file with Multer memory storage.
3. The backend streams the image to Cloudinary v2.
4. The returned Cloudinary URL is saved in MongoDB as the item image URL.
5. The customer frontend and admin panel render the saved image URL.

This avoids relying on Render's ephemeral filesystem.

---

## Authentication

Customer and admin authentication use JWTs stored in **httpOnly cookies**.

- Customer cookie: `token`
- Admin cookie: `adminToken`
- Cookies are `SameSite=None; Secure` in production HTTPS environments.
- Localhost requests use local-friendly cookie settings.
- Protected frontend/admin API calls must use `withCredentials: true`.

The backend still has route middleware for user auth and admin auth. Admin routes for item mutation and order management are protected with `adminAuth`.

---

## Project Structure

```text
project_sister/
|-- backend/
|   |-- config/
|   |   `-- db.js                  # MongoDB connection
|   |-- controllers/
|   |   |-- adminAuthController.js # Admin login/logout
|   |   |-- cartController.js
|   |   |-- itemController.js
|   |   |-- orderController.js     # Midtrans integration and order logic
|   |   `-- userController.js
|   |-- middleware/
|   |   |-- adminAuth.js
|   |   |-- auth.js
|   |   `-- rateLimiters.js
|   |-- modals/                    # Mongoose models; folder name kept from original project
|   |   |-- cartModal.js
|   |   |-- itemModal.js
|   |   |-- orderModal.js
|   |   `-- userModal.js
|   |-- routes/
|   |   |-- adminAuthRoutes.js
|   |   |-- cartRoutes.js
|   |   |-- itemRoute.js           # Cloudinary v2 upload stream
|   |   |-- orderRoutes.js
|   |   `-- userRoutes.js
|   |-- utils/
|   |   `-- authCookies.js
|   |-- package.json
|   `-- server.js
|
|-- frontend/
|   `-- src/
|       |-- cartContext/           # Cart state and cart API calls
|       |-- components/
|       |   |-- Banner/
|       |   |-- CartPage/
|       |   |-- Checkout/
|       |   |-- Login/
|       |   |-- MyOrder/
|       |   |-- Navbar/
|       |   |-- OurHomeMenu/
|       |   |-- OurMenu/
|       |   |-- PrivateRoute/
|       |   |-- SignUp/
|       |   `-- SpecialOffer/
|       |-- pages/
|       |   |-- CheckoutPage/
|       |   |-- MyOrderPage/
|       |   `-- VerifyPaymentPage/
|       `-- App.jsx
|
|-- admin/
|   `-- src/
|       `-- components/
|           |-- AddItem.jsx
|           |-- List.jsx
|           |-- Login.jsx
|           |-- Navbar.jsx
|           `-- Order.jsx
|
`-- README.md
```

---

## Features

### Customer

- Register, login, and logout with httpOnly cookie auth.
- Browse menu items.
- Add, update, remove, and clear cart items.
- Checkout with delivery details.
- Pay with Cash on Delivery or Midtrans online payment.
- View order history and payment/order status.

### Admin

- Login and logout with admin httpOnly cookie auth.
- Add menu items with Cloudinary image upload.
- Delete menu items.
- Update item price.
- View all customer orders.
- Update delivery status only: `processing`, `outForDelivery`, or `delivered`.

---

## API Reference

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/user/register` | Register customer and set auth cookie | No |
| POST | `/api/user/login` | Login customer and set auth cookie | No |
| POST | `/api/user/logout` | Clear customer auth cookie | No |
| POST | `/api/admin/login` | Login admin and set admin cookie | No |
| POST | `/api/admin/logout` | Clear admin cookie | No |
| GET | `/api/items` | Get menu items | No |
| POST | `/api/items` | Add menu item with image upload | Admin |
| DELETE | `/api/items/:id` | Delete menu item | Admin |
| PATCH | `/api/items/:id/price` | Update item price | Admin |
| GET | `/api/cart` | Get current user's cart | User |
| POST | `/api/cart` | Add item to cart | User |
| PUT | `/api/cart/:id` | Update cart item quantity | User |
| DELETE | `/api/cart/:id` | Delete cart item | User |
| POST | `/api/cart/clear` | Clear cart | User |
| POST | `/api/orders` | Create COD or Midtrans order | User |
| GET | `/api/orders` | Get current user's orders | User |
| GET | `/api/orders/payment-status/:orderId` | Check Midtrans payment status | User |
| GET | `/api/orders/:id` | Get a single user order | User |
| PUT | `/api/orders/:id` | Update a user order | User |
| POST | `/api/orders/midtrans-notification` | Midtrans webhook callback | No |
| GET | `/api/orders/getall` | Get all orders | Admin |
| PUT | `/api/orders/getall/:id` | Update delivery status only | Admin |

---

## Getting Started

Prerequisites:

- Node.js v18 or newer
- MongoDB Atlas database
- Cloudinary account
- Midtrans sandbox or production account

Install dependencies:

```bash
git clone <repo-url>
cd project_sister

cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

Run each service in a separate terminal:

```bash
cd backend
npm run dev

cd frontend
npm run dev

cd admin
npm run dev
```

Default local URLs:

- Backend: http://localhost:4000
- Customer frontend: http://localhost:5173
- Admin panel: http://localhost:5174

---

## Deployment Notes

The production setup uses separate services for backend, frontend, and admin. The backend CORS allowlist currently includes the custom domains and Render static-site domains.

Important production notes:

- Set all backend environment variables in the Render backend service.
- Use HTTPS domains for customer/admin apps so cross-site cookies can be sent securely.
- Keep `MIDTRANS_IS_PRODUCTION=false` for sandbox and `true` only for production credentials.
- Configure the Midtrans payment notification URL to point to:

```text
https://fourbite-backend.onrender.com/api/orders/midtrans-notification
```

- Uploaded images are stored on Cloudinary, not on the Render server filesystem.

---

## Current Known Improvements

- Some frontend/admin API calls still hardcode the backend Render URL. A future cleanup should move those calls into a shared Axios client using `VITE_BACKEND_URL`.
- `getItems()` and `getAllOrders()` still return all rows without pagination.
- Backend still keeps both `bcrypt` and `bcryptjs` because user auth and admin auth currently use different packages.
- The backend folder is named `modals`, although it contains Mongoose models.

---

## What I Learned

**Authentication flow**: moving from browser-stored tokens to httpOnly cookies reduces token exposure and requires correct CORS and `withCredentials` behavior.

**Image handling in production**: Render's filesystem is ephemeral, so uploaded menu images must live in Cloudinary. The current backend streams Multer memory uploads directly to Cloudinary v2.

**Midtrans payment integration**: online payment requires server-side Snap transaction creation, frontend Snap popup handling, webhook processing, and status polling/fallback routes.

**Multi-service deployment**: the customer frontend, admin panel, backend API, MongoDB Atlas, Cloudinary, and Midtrans all run as separate services that communicate over network boundaries.

**Server-side order validation**: order totals should be recalculated on the backend from database item prices instead of trusting totals sent from the browser.

---

## License

MIT License

Copyright (c) 2026 Ikroma Hataf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
