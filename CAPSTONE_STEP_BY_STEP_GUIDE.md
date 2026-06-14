# Capstone Step-by-Step Guide: Voucher Redemption System

This guide is based on the rubric and capstone slides. Build the project in this order so your work matches the highest-mark requirements first.

## 1. What You Are Building

Build a mobile-responsive MERN voucher redemption web app for Carter Bank.

Core story:

1. A user signs up or logs in, including Google login.
2. The user sees latest vouchers from all categories.
3. The user can browse by category, search vouchers, and open voucher details.
4. The user can redeem immediately or add vouchers to a cart.
5. During checkout, points are deducted.
6. A PDF voucher is generated with unique coupon codes and ideally QR codes.
7. Admin users can create, edit, delete, and monitor vouchers.

## 2. Rubric Priorities

Focus your time according to the marks:

| Rubric Area | Marks | What To Prove |
| --- | ---: | --- |
| Functionality and Features | 25 | Voucher CRUD, Google login, user/admin roles, redemption logic |
| Technical Implementation | 20 | MERN stack, Passport.js, JWT, protected routes, MongoDB schema |
| UI/UX Design | 10 | PrimeReact Sakai theme, responsive, easy to use |
| Customization and Creativity | 10 | Referral, QR redemption, analytics, multi-language, or similar extras |
| PDF Integration | 10 | User can save voucher PDF with unique voucher code and QR code |
| Code Quality and Structure | 10 | Clean models, controllers, routes, middleware, reusable frontend structure |
| Deployment | 5 | Frontend on Netlify/Vercel, backend on Render/Heroku, MongoDB Atlas |
| Documentation | 5 | README, setup, API usage, clear GitHub repo |
| Presentation | 5 | Demo video/slides explaining project and showing the working app |

Rule of thumb: finish auth, roles, vouchers, cart, redeem, PDF, and protected APIs before adding creative extras.

## 3. Recommended Project Structure

Use one GitHub repo with separate frontend and backend folders:

```text
capstone/
  backend/
    config/
      db.js
      passport.js
    controllers/
      authController.js
      voucherController.js
      categoryController.js
      cartController.js
      redeemController.js
      analyticsController.js
    middleware/
      auth.js
      requireAdmin.js
      errorHandler.js
    models/
      User.js
      Category.js
      Voucher.js
      CartItem.js
      CartItemHistory.js
    routes/
      authRoutes.js
      voucherRoutes.js
      categoryRoutes.js
      cartRoutes.js
      redeemRoutes.js
      analyticsRoutes.js
    utils/
      voucherPdf.js
      qrCode.js
    seed/
      seed.js
    server.js
    .env
  frontend/
    src/
      api/
      components/
      layouts/
      pages/
      routes/
      store/
      styles/
```

Do not commit `.env`.

## 4. Phase 1: Plan, Wireframe, and Schema

Deliverable target: your wireframe, database design, first backend connection, and seed data.

### Step 1: Define the pages

Create a simple wireframe in Figma, PowerPoint, paper, or directly in code:

1. Login / sign up page
2. Google login button
3. Home page with latest vouchers
4. Category page
5. Search results or search bar
6. Voucher details page
7. Cart overlay or cart page
8. Checkout / redemption success popup
9. Voucher PDF download
10. Terms and Conditions page/view
11. User profile page with points and redemption history
12. Admin dashboard
13. Admin voucher management page
14. Admin analytics page

### Step 2: Create the five required MongoDB collections

Use these as your base Mongoose models:

1. `User`
   - `email`: String, required, unique
   - `username`: String, required, unique
   - `password`: String, required for email/password users, hashed
   - `googleId`: String, optional for Google login
   - `role`: String, enum `user` or `admin`, default `user`
   - `is_active`: Boolean, default true
   - `points`: Number, default starting balance, min 0

2. `Category`
   - `name`: String, required, unique

3. `Voucher`
   - `category_id`: ObjectId ref `Category`, required
   - `points`: Number, required, min 0
   - `title`: String, required
   - `image`: String
   - `description`: String
   - `terms`: String
   - `limit`: Number
   - `redeemedCount`: Number, default 0
   - `expiryDate`: Date
   - `isActive`: Boolean, default true

4. `CartItem`
   - `user`: ObjectId ref `User`, required
   - `voucher`: ObjectId ref `Voucher`, required
   - `quantity`: Number, default 1, min 1

5. `CartItemHistory`
   - `user`: ObjectId ref `User`, required
   - `voucher`: ObjectId ref `Voucher`, required
   - `quantity`: Number, min 1
   - `couponCode`: String, required
   - `qrCode`: String or image URL/data, optional
   - `timestamp`: Date, default now

### Step 3: Seed starter data

Create at least:

1. Three categories, for example Food, Travel, Shopping
2. Five vouchers with points, images, descriptions, expiry dates, and terms
3. One test user with enough points
4. One admin user

Checkpoint:

- MongoDB connects from `config/db.js`.
- All five models exist.
- Seed data appears in MongoDB.
- Repo has `.gitignore` and first commit.

## 5. Phase 2: Backend APIs, Auth, and Roles

Deliverable target: protected backend APIs tested with Postman.

### Step 1: Install backend dependencies

Use dependencies like:

```bash
npm install express mongoose cors dotenv jsonwebtoken passport passport-google-oauth20 bcryptjs cookie-session pdfkit qrcode uuid
```

### Step 2: Implement auth

Required auth behavior:

1. Email/password sign up
2. Email/password login
3. Google OAuth using Passport.js
4. JWT returned to the frontend
5. Auth middleware checks `Authorization: Bearer <token>`
6. Role middleware blocks user-only accounts from admin routes

Suggested endpoints:

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me
```

Checkpoint:

- Passwords are hashed with bcrypt.
- JWT includes user id and role.
- Bad login returns `401`.
- Protected route without token returns `401`.

### Step 3: Build category and voucher APIs

Suggested endpoints:

```text
GET    /api/categories
POST   /api/categories              admin only
PUT    /api/categories/:id          admin only
DELETE /api/categories/:id          admin only

GET    /api/vouchers
GET    /api/vouchers/:id
GET    /api/vouchers/category/:id
POST   /api/vouchers                admin only
PUT    /api/vouchers/:id            admin only
DELETE /api/vouchers/:id            admin only
```

Use `.populate('category_id')` when returning vouchers.

Checkpoint:

- Admin can create/edit/delete vouchers.
- Users can only browse vouchers.
- Vouchers include limit and expiry.
- All APIs return useful success/error status codes.

### Step 4: Build cart APIs

Suggested endpoints:

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
DELETE /api/cart
```

Required behavior:

1. Add one voucher or `n` quantity to cart
2. Add multiple vouchers
3. Edit cart quantity
4. Delete voucher from cart
5. Cart data belongs only to the logged-in user
6. Cart APIs are authenticated

Checkpoint:

- Cart is stored in MongoDB, not just local state.
- Quantity cannot go below 1.
- UI can show full voucher details by using `populate('voucher')`.

## 6. Phase 3: Redemption, Points, PDF, and QR

Deliverable target: the main business workflow works end to end.

### Step 1: Implement redemption logic

Suggested endpoints:

```text
POST /api/redeem/voucher/:voucherId
POST /api/redeem/cart
GET  /api/redemptions/history
GET  /api/redemptions/:orderId/pdf
```

For every successful redemption:

1. Get current cart items or selected voucher.
2. Calculate total points: voucher points x quantity.
3. Check user has enough points.
4. Check voucher is active, not expired, and under redemption limit.
5. Generate a unique coupon code for each voucher item.
6. Move items from `CartItem` to `CartItemHistory`.
7. Deduct total points from the user.
8. Increment voucher `redeemedCount`.
9. Clear redeemed cart items.
10. Return success with remaining points and PDF download link.

Important: the slides say these steps should succeed together. If you can, use a MongoDB transaction/session. If not, keep the code order careful and handle errors clearly.

### Step 2: Implement failure cases

Show a failure popup when:

1. User has not enough points
2. Voucher is expired
3. Voucher limit is reached
4. Cart is empty
5. User is not logged in
6. Server error happens

Use status codes:

```text
200 OK
201 Created
204 Deleted
400 Bad request
401 Not authenticated
403 Not authorized
404 Not found
500 Server error
```

### Step 3: Generate voucher PDF

PDF must include:

1. Carter Bank branding
2. User name/email
3. Voucher title
4. Quantity
5. Points spent
6. Unique coupon code
7. QR code
8. Expiry date
9. Terms and Conditions

Recommended packages:

```text
pdfkit
qrcode
uuid
```

Checkpoint:

- After successful checkout, PDF downloads.
- Each voucher item has a unique coupon code.
- QR code appears in the PDF.
- User points decrease immediately.
- Cart is empty after checkout.
- Order history displays the redeemed vouchers.

## 7. Phase 4: Frontend with PrimeReact Sakai

Deliverable target: polished responsive UI that calls real APIs.

### Step 1: Set up frontend

Use React with PrimeReact and Sakai theme.

Required packages from the slides:

```bash
npm install primereact primeicons primeflex
npm install chart.js react-chartjs-2
```

If you use Redux, keep auth and cart state there. If you prefer simpler state, React Context is acceptable, but the slides mention Redux.

### Step 2: Build user pages

Build in this order:

1. Login/sign up with validation
2. Google login button
3. Protected layout
4. Home page: latest vouchers from all categories
5. Category page: vouchers filtered by category
6. Voucher details page: image, points, terms, redeem/add cart buttons
7. Cart overlay: quantity edit, remove, checkout
8. Redemption popup: success/failure from API response
9. PDF download button
10. User profile: points, profile edit, redemption history
11. Terms and Conditions view

Frontend rule: all visible voucher/cart/profile data should come from MongoDB through APIs.

### Step 3: Build admin pages

Admin pages:

1. Dashboard summary
2. Voucher table with create/edit/delete
3. Category management
4. Analytics for top redemption and low redemption vouchers
5. Optional time-based redemption trends

Use PrimeReact components:

1. `DataTable` for admin voucher list
2. `Dialog` for create/edit forms
3. `Toast` for success/error notifications
4. `Card` for voucher display
5. `Chart` for analytics
6. `Button`, `InputText`, `Dropdown`, `Calendar`, `InputNumber` for forms

### Step 4: Make it responsive

Test in browser DevTools mobile simulator.

Check:

1. Login fits phone width
2. Voucher cards stack cleanly
3. Cart overlay works on phone
4. Admin tables do not overflow badly
5. Buttons are easy to tap
6. PDF download works from mobile width
7. No text overlaps or gets clipped

## 8. Phase 5: Creative Extras

Only start these after the core app works.

Pick one or two extras that you can demo confidently:

1. QR redemption: admin or staff can scan/validate coupon code
2. Referral system: user gets referral code, referred users give bonus points
3. Analytics: top vouchers, low redemption vouchers, time-based trends
4. Multi-language support: English/Malay toggle
5. Email notification after redemption
6. AI customer service chatbot

Best choice for scoring: QR redemption plus analytics. They match the rubric directly.

## 9. Phase 6: Testing Checklist

### Backend tests with Postman

Test these before relying on the UI:

1. Sign up creates user
2. Login returns JWT
3. Google login works
4. `GET /api/auth/me` works with token
5. User cannot access admin route
6. Admin can create category
7. Admin can create voucher
8. User can list vouchers
9. User can filter vouchers by category
10. User can add voucher to cart
11. User can edit cart quantity
12. User can delete cart item
13. User cannot redeem more points than they have
14. User can successfully redeem cart
15. Points are deducted
16. Cart items move to history
17. PDF is generated
18. Unique coupon codes are created
19. Expired voucher cannot be redeemed
20. Voucher over limit cannot be redeemed

### Frontend tests in browser

1. Login/sign up validations show clear messages
2. Home loads live voucher data
3. Search works
4. Category navigation works
5. Add to cart notification appears
6. Quantity update changes total points
7. Checkout success popup appears
8. Checkout failure popup appears
9. PDF download opens/saves file
10. User points update without refresh, or after a clean refresh
11. Admin pages are blocked for normal user
12. Admin CRUD updates the UI
13. Mobile width looks good

## 10. Deployment Checklist

Use:

1. MongoDB Atlas for database
2. Render or Heroku for backend
3. Vercel or Netlify for frontend

Backend environment variables:

```text
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FRONTEND_URL=
```

Frontend environment variables:

```text
VITE_API_URL=
```

Deployment checks:

1. Backend can connect to Atlas
2. CORS allows the deployed frontend URL
3. Google OAuth callback URL matches deployed backend URL
4. Frontend uses deployed API URL
5. PDF endpoint works after deployment
6. README contains both live links

## 11. Documentation Checklist

Your README should include:

1. Project title
2. Short background: Carter Bank loyalty challenge
3. Features
4. Tech stack
5. Folder structure
6. Setup instructions for backend
7. Setup instructions for frontend
8. Environment variables
9. API endpoints
10. Test users/admin credentials
11. Deployment links
12. Screenshots
13. Known limitations

Also create a 2-page tech specification with:

1. Background
2. Design
3. User flow
4. Requirements
5. Risks
6. Test cases
7. Measuring success

## 12. Presentation Plan

The slides mention different presentation lengths, while the rubric mentions a 15-minute video or slides. Prepare a 15-minute core version that can be shortened or expanded.

Suggested structure:

1. 1 minute: problem and objective
2. 1 minute: tech stack and architecture
3. 2 minutes: database schema and relationships
4. 2 minutes: auth, JWT, roles, protected routes
5. 3 minutes: user demo from login to voucher redemption
6. 2 minutes: PDF, unique code, QR, and points deduction
7. 1 minute: admin voucher CRUD and analytics
8. 1 minute: responsive/mobile demo
9. 1 minute: deployment, README, and next improvements
10. 1 minute: close and Q&A

Demo script:

1. Log in as user.
2. Show home page with latest vouchers.
3. Browse category and search voucher.
4. Open voucher details and Terms and Conditions.
5. Add voucher to cart.
6. Edit quantity.
7. Try a failure case if possible, such as not enough points.
8. Redeem successfully.
9. Show points deducted.
10. Download/open PDF with unique code and QR.
11. Show order history.
12. Log in as admin.
13. Create/edit/delete voucher.
14. Show analytics dashboard.
15. Show mobile responsive view.

## 13. Final "Ready To Submit" Checklist

You are ready when all of these are true:

1. User auth works with email/password and Google OAuth.
2. JWT protected routes work.
3. User/admin role protection works.
4. Admin voucher CRUD works.
5. Voucher limit and expiry logic work.
6. User can browse latest vouchers and categories.
7. User can search vouchers.
8. User can add, edit, and delete cart items.
9. User can redeem voucher/cart.
10. Points are deducted correctly.
11. Cart moves to order history after checkout.
12. PDF downloads after successful redemption.
13. PDF includes unique coupon code and QR code.
14. Success and failure popups use real API responses.
15. Analytics shows top and low redemption vouchers.
16. UI uses PrimeReact Sakai theme.
17. App works on desktop and mobile simulator.
18. Backend and frontend are deployed.
19. GitHub repo is clean and documented.
20. README and 2-page tech specification are done.
21. Presentation/demo is rehearsed.

## 14. Suggested Build Order If Time Is Short

If you are rushing, do this order:

1. Backend models and MongoDB connection
2. Seed categories, vouchers, user, admin
3. Auth with JWT and roles
4. Voucher/category APIs
5. Cart APIs
6. Redeem API with points deduction
7. PDF with unique code
8. React login and home page
9. Voucher details and cart UI
10. Admin voucher CRUD
11. Mobile styling
12. Analytics
13. QR code
14. Deployment
15. README, tech spec, presentation

Do not spend too long on colors, animations, or extras before the redemption flow is working.
