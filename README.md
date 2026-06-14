# Carter Bank Voucher Redemption System

MERN capstone project for a mobile-responsive loyalty voucher web app with user/admin roles, Google OAuth, JWT protected APIs, voucher CRUD, cart redemption, points deduction, analytics, and downloadable voucher PDFs with unique coupon codes and QR codes.

## Features

- Email/password sign up and login
- Google OAuth login with Passport.js
- JWT authentication and protected API routes
- User and admin roles
- Admin voucher/category CRUD
- Voucher limit and expiry fields
- Voucher browsing, category filter, and search
- Cart add/edit/delete workflow
- Direct voucher redemption and cart checkout
- Points deduction after successful redemption
- Redemption history
- Voucher PDF download with unique coupon codes and QR codes
- Admin analytics for top and low redemption vouchers
- Responsive React UI using PrimeReact

## Tech Stack

- Frontend: React, Vite, PrimeReact, PrimeFlex, React Router, Axios, Chart.js
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: Passport.js Google OAuth, JWT, bcryptjs
- PDF/QR: PDFKit, qrcode
- Deployment target: Vercel/Netlify frontend, Render/Heroku backend, MongoDB Atlas database

## Folder Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  seed/
  utils/
frontend/
  src/
    api/
    components/
    layouts/
    pages/
    routes/
    state/
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Update `backend/.env` before running:

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carter-vouchers
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

If you do not configure Google OAuth yet, normal email/password login still works.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Seeded Demo Accounts

After `npm run seed`:

```text
User:  user@carter.test
Admin: admin@carter.test
Password for both: password123
```

## Main API Endpoints

Auth:

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/me
PUT  /api/auth/me
```

Categories:

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Vouchers:

```text
GET    /api/vouchers
GET    /api/vouchers/:id
POST   /api/vouchers
PUT    /api/vouchers/:id
DELETE /api/vouchers/:id
```

Cart and redemption:

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
POST   /api/redeem/cart
POST   /api/redeem/voucher/:voucherId
GET    /api/redeem/history
GET    /api/redeem/orders/:orderId/pdf
```

Analytics:

```text
GET /api/analytics/summary
```

## Demo Flow

1. Login as `user@carter.test`.
2. Browse vouchers on the home page.
3. Filter by category or search.
4. Open voucher details and view terms.
5. Add voucher to cart.
6. Edit quantity in cart.
7. Checkout and redeem.
8. Confirm points are deducted.
9. Download voucher PDF with coupon code and QR code.
10. Open profile and view redemption history.
11. Login as `admin@carter.test`.
12. Create/edit/delete vouchers.
13. Open admin dashboard and show analytics.
14. Use browser mobile simulator to show responsive layout.

## Deployment Notes

Backend:

- Deploy `backend` to Render or Heroku.
- Use MongoDB Atlas for `MONGO_URI`.
- Set `FRONTEND_URL` to your deployed frontend URL.
- Set Google callback URL to your deployed backend callback.

Frontend:

- Deploy `frontend` to Vercel or Netlify.
- Set `VITE_API_URL` to your deployed backend `/api` URL.

## Rubric Mapping

- Functionality: auth, roles, voucher CRUD, cart, redemption, points, history.
- Technical: MERN, Mongoose schema, JWT, Passport.js, protected routes.
- UI/UX: PrimeReact, responsive layout, loading/error/success states.
- Creativity: QR code, analytics, direct redeem plus cart checkout.
- PDF: PDF voucher download with unique coupon code and QR code.
- Code quality: modular models, controllers, routes, middleware, utilities.
- Deployment: env examples and deploy-ready folder structure.
- Documentation: this README plus `TECH_SPEC.md`.
- Presentation: demo flow above.
