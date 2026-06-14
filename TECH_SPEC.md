# Carter Bank Voucher Redemption System - Tech Specification

## 1. Background

Carter Bank wants to improve customer retention and engagement through a mobile-responsive loyalty web app. Customers collect points and redeem them for vouchers. The app must support voucher browsing, cart checkout, points deduction, downloadable coupon PDFs, and admin management.

## 2. Design

The app uses a MERN architecture:

- React frontend handles user interaction and responsive UI.
- Express backend exposes authenticated JSON APIs.
- MongoDB stores users, categories, vouchers, live cart items, and redemption history.
- JWT identifies the logged-in user on protected routes.
- Passport.js handles Google OAuth.

The UI uses PrimeReact components for tables, dialogs, cards, buttons, inputs, toasts, and charts.

## 3. User Flow

1. User signs up or logs in.
2. User lands on the voucher marketplace.
3. User filters vouchers by category or search.
4. User opens a voucher detail page.
5. User either redeems immediately or adds the voucher to cart.
6. User edits cart quantities and checks out.
7. Backend validates points, voucher expiry, and voucher limit.
8. Backend moves cart items to redemption history.
9. Backend deducts points and generates coupon codes/QR codes.
10. User downloads a voucher PDF.
11. Admin manages vouchers and reviews analytics.

## 4. Requirements

Functional requirements:

- User sign up/login and Google login
- JWT protected routes
- User/admin roles
- Voucher CRUD for admin
- Voucher browse/search/filter for users
- Cart add/edit/delete
- Direct voucher redemption
- Cart checkout redemption
- Points deduction
- Order history
- PDF download with unique coupon code and QR code
- Analytics for top and low redemption vouchers
- Mobile-responsive UI

Non-functional requirements:

- Clear API status codes
- Form validation
- Modular backend structure
- Responsive frontend layout
- Deployment-ready environment configuration

## 5. Database

Collections:

- `User`: email, username, password hash, googleId, role, is_active, points
- `Category`: name
- `Voucher`: category_id, points, title, image, description, terms, limit, redeemedCount, expiryDate, isActive
- `CartItem`: user, voucher, quantity
- `CartItemHistory`: orderId, user, voucher, quantity, couponCode, qrCode, timestamp

Relationships:

- Voucher references Category.
- CartItem references User and Voucher.
- CartItemHistory references User and Voucher.

## 6. Risks

- Google OAuth callback URL must match deployment settings.
- MongoDB transactions require Atlas or a replica-set MongoDB setup. The code falls back for local standalone MongoDB.
- PDF image/QR generation must be tested after deployment.
- Admin routes must remain protected from normal users.
- Voucher limits and expiry dates must be validated during redemption, not only in the UI.

## 7. Test Cases

- Sign up with valid data.
- Login with valid/invalid password.
- Access protected route with and without token.
- Normal user cannot access admin API.
- Admin can create, edit, and delete voucher.
- User can browse vouchers from database.
- User can add item to cart.
- User can edit and delete cart item.
- Checkout fails when points are insufficient.
- Checkout fails when voucher is expired.
- Checkout succeeds when data is valid.
- Points decrease after checkout.
- Cart clears after checkout.
- Cart items move to history.
- PDF downloads and includes coupon code and QR code.
- Admin analytics show top and low redemption vouchers.
- UI works in mobile simulator.

## 8. Measuring Success

Success is measured by:

- End-to-end demo works without manual database edits.
- User can redeem a voucher and download the PDF.
- Admin can manage vouchers.
- All core APIs return correct success/error responses.
- Mobile layout is usable.
- Project is deployed with working frontend, backend, and database.
- README lets another person run the project.
