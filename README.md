# Vendora Admin Dashboard

Vendora Admin is a **server-side rendered (SSR) admin dashboard** built to manage products, categories, orders, and sales for an e-commerce system.  
It is designed for **real-world inventory and order management**, with a strong focus on performance, security, and admin-only access.

🔗 **Live Demo:** https://vendora-admin-chm2.vercel.app/

---

## Project Overview

This project implements a production-style **admin panel for e-commerce operations** using **Next.js with server-side rendering**.  
All sensitive operations — authentication, product creation, order updates, and stock adjustments — are handled securely on the server.

The dashboard enables administrators to:
- Maintain structured product catalogs
- Track stock and sales in real time
- Manage orders across different statuses
- Analyze performance using interactive charts

The system is built with scalability and maintainability in mind, using centralized validation, role-based access control, and reusable UI components.

---

## Features

### Product & Inventory Management
- Full **product CRUD** with secure image uploads
- **Category-based product organization**  
  (Home Appliances, Mobile & Accessories, Laptop & Accessories, Smart Gadgets, Gaming & Entertainment)
- **Stock status indicators**: In Stock, Low Stock, Out of Stock
- Advanced product filtering & sorting:
  - Search by product name
  - Filter by category
  - Min / max price filtering
  - Sort by:
    - Name
    - Price (low → high / high → low)
    - Stock (low → high / high → low)

### Order Management
- Manual **order creation** (useful for offline store orders)
- Auto-generated **order numbers**
- Order status tracking: **Pending, Completed, Cancelled**
- Stock, sales count, and revenue automatically synced on order status updates
- Centralized order view to maintain operational checks across all sales channels

### Dashboard & Analytics
- Interactive charts for **sales and inventory insights**
- **Category-filtered visualizations** for better analysis
- Live dashboard search:
  - Search orders by customer name, email, or order ID
  - Grouped customer results for clarity

### Authentication & Access Control
- Secure admin authentication using **NextAuth**
- **Role-based JWT sessions** with role embedded in token and session
- Admin-only routes, APIs, and UI elements
- Admin onboarding option visible only to authenticated admins
- Bootstrap admin credentials for initial access when no admin exists

### Server-Side Architecture
- **Server-side rendering (SSR)** for improved performance and SEO
- **Server Actions** for product workflows:
  - Handle FormData
  - Validate inputs
  - Upload images
  - Persist data
  - Redirect after actions
- Centralized schema validation using **Zod**
- Consistent API error handling with structured responses
- Optimized database connection reuse with Mongoose

---

## Tech Stack

- **Next.js** — SSR framework & routing
- **React** — UI development
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **next-auth** — Authentication & session management
- **MongoDB + Mongoose** — Database & ODM
- **Cloudinary** — Image uploads & storage
- **bcryptjs** — Password hashing
- **Zod** — Input validation
- **Recharts** — Charts & data visualization
- **Node.js** — Runtime environment

---

## Demo Admin Credentials

Use the following credentials to explore the dashboard:
- **Email:** lakshikagarg26@gmail.com
- **Password:** LakshikaGarg26


## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local` (see SETUP.md)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
