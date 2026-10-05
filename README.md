# SamaanHub

### High-Speed Product Catalog Platform

SamaanHub is a reusable product catalog platform that imports products from
Shopify and WooCommerce into a centralized database and serves them through
a fast internal API.

The main goal of the project is to provide a fast, mobile-first catalog
experience without depending on external e-commerce APIs during every
customer page visit.

---

## ✨ Features

### Product Management
- Import products from Shopify
- Import products from WooCommerce
- Centralized product database
- Product search and filtering
- Product categories
- Product availability and pricing
- Product variants
- Related products

### 🔄 Import & Synchronization
- Shopify product import
- WooCommerce product import
- Manual synchronization
- New product detection
- Product update detection
- Duplicate prevention
- Sync history
- Sync error tracking

### 🎨 Multiple Catalog Designs
- Premium customer-facing catalog
- Two different catalog designs
- Design switching from the admin panel
- Same product data and API shared across designs
- New designs can be added without changing the core data layer

### 📱 Customer Experience
- Mobile-first responsive design
- Product search
- Category browsing
- Product details
- Image gallery / lightbox
- Wishlist without user accounts
- Multi-product enquiry selection
- WhatsApp enquiry
- No traditional cart or checkout

### ⚡ Performance
- Optimized image delivery
- Lazy loading
- Responsive image sizes
- Skeleton loading states
- Progressive product loading
- Pagination / infinite loading
- Minimal API payloads
- Customer frontend communicates with the internal API

### 🔐 Admin Panel
- Admin authentication
- Dashboard
- Product management
- Category management
- Shopify/WooCommerce imports
- Synchronization
- Sync history
- Catalog design selection
- Store configuration
- WhatsApp configuration

---

## 🏗️ Architecture

```text
              ┌─────────────────┐
              │     Shopify     │
              └────────┬────────┘
                       │
                       │ Import / Sync
                       ▼
              ┌─────────────────┐
              │ Import & Sync   │
              │     Engine      │
              └────────┬────────┘
                       │
                       │ Normalize
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │   (Supabase)    │
              └────────┬────────┘
                       │
                       │ Internal API
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │  Catalog API    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ React + Vite    │
              │ Customer Catalog│
              └─────────────────┘

              WooCommerce
                   │
                   └──── Import / Sync
