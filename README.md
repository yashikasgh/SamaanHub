# SamaanHub

**SamaanHub** is a high-speed, mobile-first product catalog platform that imports products from external e-commerce platforms such as Shopify and WooCommerce into a centralized database.

Instead of calling external APIs every time a customer browses the catalog, SamaanHub uses its own backend API and database to provide fast product browsing, search, filtering, and product details.

## ✨ Features

- 📦 Import products from Shopify and WooCommerce
- 🔄 Sync product prices, descriptions, images, stock, and availability
- 🗄️ Centralized PostgreSQL product database
- ⚡ Fast internal REST API using FastAPI
- 🔎 Product search and category filtering
- 🖼️ Optimized product images with Cloudinary
- ❤️ Wishlist with browser-side persistence
- 💬 WhatsApp enquiry for one or multiple products
- 🎨 Two switchable catalog designs
- 📱 Responsive mobile-first customer interface
- 🔐 Protected admin dashboard with JWT authentication
- 📊 Sync history and error tracking
- ☁️ Production deployment using Vercel and Render

## 🏗️ Architecture

```text
 Shopify API ───────┐
                    │
 WooCommerce API ──┤
                    ▼
             Import / Sync Engine
                    │
                    ▼
             PostgreSQL / Supabase
                    │
                    ▼
              FastAPI Backend
                    │
                    ▼
             React Customer UI
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Product Catalog      WhatsApp
```

The customer-facing catalog primarily uses the **internal database and API**, keeping the browsing experience independent of external API response times.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Frontend Libraries** | React Router, TanStack Query |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **ORM / Database Driver** | SQLAlchemy, psycopg |
| **Database** | PostgreSQL, Supabase |
| **E-commerce Integrations** | Shopify Admin API, WooCommerce REST API |
| **Image Management** | Cloudinary |
| **Authentication** | JWT, bcrypt / Passlib |
| **Deployment** | Vercel, Render |
| **Version Control** | Git, GitHub |

## 📁 Project Structure

```text
Samaanhub/
├── frontend/          # React customer catalog & admin dashboard
├── backend/           # FastAPI backend and integrations
├── docs/              # Project documentation
├── README.md
└── .gitignore
```

## 🔄 Product Synchronization

SamaanHub normalizes products from different sources into a common product structure.

The synchronization system:

1. Fetches products from Shopify or WooCommerce.
2. Converts them into the internal product format.
3. Creates new products or updates existing products.
4. Prevents duplicate products using source-specific identifiers.
5. Stores synchronization history and errors.
6. Keeps previously synced products available even if an external source is temporarily unavailable.

## 🎨 Catalog Designs

The platform supports multiple frontend designs using the same product database and backend API.

- **Design A — Premium Minimal**
- **Design B — Editorial Gallery**

The active design can be changed from the admin panel without changing the underlying product data or import system.

## 💬 WhatsApp Enquiry

SamaanHub uses WhatsApp as the primary product conversion flow instead of traditional cart and checkout functionality.

Customers can select multiple products and generate a pre-filled WhatsApp enquiry containing the selected product names and links.

## 🚀 Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file with the required database, Shopify, WooCommerce, Cloudinary, and authentication configuration.

Start the backend:

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🌐 Live Demo

**Customer Catalog:**  
https://samaan-hub.vercel.app

**Backend API:**  
https://samaanhub.onrender.com

