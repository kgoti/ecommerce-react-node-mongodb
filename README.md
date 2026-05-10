# 🛒 ShopEasy — E-Commerce Full-Stack App

A complete online shop built with **React** (frontend) + **Node.js / Express** (backend) + **MongoDB** (database).

## What the App Does
- Browse a product catalogue with search and category filters
- View full product details with a quantity selector
- Add products to a shopping cart (saved in localStorage)
- Register / log in with a personal account
- Enter a shipping address and place an order
- View all past orders with status badges

## Tech Stack
| Layer    | Technology                             |
|----------|----------------------------------------|
| Frontend | React 18, plain CSS                    |
| Backend  | Node.js, Express                       |
| Database | MongoDB with Mongoose                  |
| Auth     | JWT (jsonwebtoken) + bcryptjs          |

---

## Folder Structure
```
ecommerce/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js   ← protects private routes with JWT
│   ├── models/
│   │   ├── User.js             ← user schema (name, email, hashed password)
│   │   ├── Product.js          ← product schema (name, price, image, stock)
│   │   └── Order.js            ← order schema (user, items, address, total)
│   ├── routes/
│   │   ├── auth.js             ← POST /api/auth/register and /login
│   │   ├── products.js         ← GET /api/products, GET /api/products/:id
│   │   └── orders.js           ← POST /api/orders, GET /api/orders/mine
│   ├── .env                    ← secrets (NOT pushed to GitHub)
│   ├── .gitignore
│   ├── package.json
│   └── server.js               ← entry point
│
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js       ← top navigation bar
│   │   │   └── ProductCard.js  ← product card in the grid
│   │   ├── pages/
│   │   │   ├── HomePage.js     ← product listing with search/filter
│   │   │   ├── DetailPage.js   ← single product detail view
│   │   │   ├── CartPage.js     ← shopping cart
│   │   │   ├── CheckoutPage.js ← shipping form + place order
│   │   │   ├── OrdersPage.js   ← past orders list
│   │   │   └── AuthPage.js     ← login / register
│   │   ├── App.js              ← root: manages all pages, cart, auth
│   │   ├── App.css             ← all styles
│   │   └── index.js            ← React entry point
│   └── package.json
│
└── README.md
```

---

## How to Run

You need **two terminals** open at the same time.

### Step 1 — Start the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:5000
```

### Step 2 — Add sample products (do this ONCE)

Open your browser and go to:
```
POST http://localhost:5000/api/products/seed
```
The easiest way is to use a tool like **Postman** or **Thunder Client** (VS Code extension).
Or run this command in a terminal:
```bash
curl -X POST http://localhost:5000/api/products/seed
```
You should see: `12 products added successfully!`

### Step 3 — Start the frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

---

## How to Use the App

1. The homepage shows all 12 products — search or filter by category
2. Click any product to see its full detail page
3. Add items to cart — the cart icon shows how many items you have
4. Click the cart to review your items and adjust quantities
5. Click "Proceed to Checkout" — if you are not logged in, it takes you to the login page first
6. Register a new account or log in
7. Fill in a shipping address and click "Place Order"
8. Click "My Orders" in the navbar to see your order history

---

## API Endpoints

| Method | Endpoint                    | Auth? | Description                   |
|--------|-----------------------------|-------|-------------------------------|
| POST   | /api/auth/register          | No    | Create new account            |
| POST   | /api/auth/login             | No    | Log in, receive JWT token     |
| GET    | /api/products               | No    | Get all products               |
| GET    | /api/products/:id           | No    | Get one product               |
| POST   | /api/products/seed          | No    | Add 12 sample products (once) |
| POST   | /api/orders                 | Yes   | Place a new order             |
| GET    | /api/orders/mine            | Yes   | Get my orders                 |

---

## How to Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: ShopEasy E-Commerce App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-app.git
git push -u origin main
```

The `.gitignore` already excludes `node_modules` and `.env`.
