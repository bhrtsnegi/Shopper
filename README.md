# 🛍️ Shopper — Billing & Inventory Management System

A full-stack desktop-style web application for product cataloging, live point-of-sale (POS) billing, and real-time inventory management.

Built with **React 19 + Vite** (frontend) and **Java 17 + Spring Boot 3 + PostgreSQL** (backend).

---

## 📸 Overview & UI Aesthetics

Shopper is built with a **desktop application aesthetic** featuring:
- **Dark Theme Design System**: Sleek slate/indigo color tokens with high contrast and readable typography.
- **Fixed App Shell**: Persistent left sidebar navigation and top status bar with breadcrumbs and live clock.
- **Interactive Data Grids**: High-density product and stock tables with real-time search and threshold badges.
- **POS Billing Screen**: Split-view layout with rapid product picking, customer details, live cart calculation, and instant bill generation.
- **Stock Movement Ledger**: Audit trail logging every `IN`, `OUT`, and `ADJUSTMENT` movement.

---

## 🏗️ Architecture & Tech Stack

```
Shopper/
├── backend/               # Spring Boot 3 REST API
│   ├── src/main/java/     # Controllers, Services, Repositories, Entities
│   └── src/main/resources # application.properties (PostgreSQL)
│
└── frontend/              # React 19 + Vite SPA
    ├── src/api/           # Modular Axios API clients
    ├── src/components/    # Sidebar, Topbar, Layout shell
    ├── src/pages/         # Dashboard, Products, Billing, Stock
    └── src/index.css      # Desktop UI design tokens & styling
```

| Layer | Technology | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React 19, JavaScript (ESM) | Vite, React Router DOM, Axios |
| **Styling** | Vanilla CSS | Custom Design Tokens, Inter & JetBrains Mono fonts |
| **Backend** | Java 17, Spring Boot 3.2.5 | Spring Data JPA, Spring Web, Hibernate, Lombok |
| **Database** | PostgreSQL 14+ | `postgresql` JDBC Driver |
| **Communication** | REST API | JSON over HTTP (proxied via Vite in dev) |

---

## 🗄️ Database Models

### 1. `Product`
- `id` (Long, PK)
- `name` (String, Required)
- `sku` (String, Unique)
- `category` (String)
- `price` (BigDecimal, Selling Price)
- `costPrice` (BigDecimal, Cost Price)
- `quantity` (Integer, Current Stock)
- `unit` (String — `pcs`, `kg`, `ltr`, `box`, etc.)
- `description` (String)
- `createdAt` / `updatedAt` (Timestamp)

### 2. `Bill` & `BillItem`
- `id` (Long, PK)
- `billNumber` (String, Unique — format: `BILL-YYYYMMDD-XXXX`)
- `customerName` / `customerPhone` (String)
- `items` (List of `BillItem` — mapped product, quantity, unitPrice, subtotal)
- `subtotal` / `discountAmount` / `totalAmount` (BigDecimal)
- `status` (`PAID`, `PENDING`, `CANCELLED`)
- `createdAt` (Timestamp)

### 3. `StockMovement`
- `id` (Long, PK)
- `product` (Product Reference)
- `type` (`IN` = Stock Added, `OUT` = Stock Deducted on Sale, `ADJUSTMENT` = Manual override)
- `quantity` (Integer)
- `referenceId` (String — Bill Number or Purchase reference)
- `note` (String)
- `date` (Timestamp)

---

## 🔌 REST API Endpoints

### Products (`/api/products`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Get all products (optional query param: `?search=term`) |
| `GET` | `/api/products/{id}` | Get single product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update product details |
| `DELETE` | `/api/products/{id}` | Remove product |
| `GET` | `/api/products/low-stock` | Retrieve products with stock $\le$ 10 |
| `GET` | `/api/products/categories` | Get unique list of product categories |
| `GET` | `/api/products/stats` | Summary statistics (total products, low stock count) |

### Bills (`/api/bills`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bills` | List all historical bills |
| `GET` | `/api/bills/{id}` | Retrieve specific invoice with items |
| `POST` | `/api/bills` | Create bill (automatically calculates totals, deducts stock & logs movements) |
| `GET` | `/api/bills/stats` | Today's bill count and paid revenue summary |

### Inventory & Stock (`/api/stock`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stock/movements` | List chronological stock movements |
| `GET` | `/api/stock/movements/product/{id}` | Get movement log for a specific product |
| `POST` | `/api/stock/movements` | Add manual movement (`IN`, `OUT`, `ADJUSTMENT`) |

---

## ⚡ Getting Started

### Prerequisites
- **Java 17** or newer installed (`java -version`)
- **Maven 3.8+** installed (`mvn -version`)
- **Node.js 18+** & npm installed (`node -v`)
- **PostgreSQL** running locally

---

### Step 1: Database Setup

Create the database in PostgreSQL:
```bash
createdb -U postgres shopperdb
```
*(Or create a database named `shopperdb` using pgAdmin / DBeaver).*

Verify or update your database credentials in:  
`backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shopperdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

### Step 2: Run the Backend

```bash
cd backend
mvn spring-boot:run
```
- The backend starts on: **`http://localhost:8080`**
- Hibernate automatically creates all necessary database tables on first launch (`ddl-auto=update`).

---

### Step 3: Run the Frontend

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
- The development server opens on: **`http://localhost:5173`**
- All `/api/*` network requests are automatically proxied to `http://localhost:8080`.

---

## 🖥️ Application Features & Walkthrough

1. **Dashboard**
   - Live KPI cards: Total Products, Low Stock Alerts, Bills Generated Today, and Today's Revenue.
2. **Products Management**
   - Search by product title or SKU.
   - Add new products or edit existing pricing, cost, stock, category, and units.
3. **Point of Sale (Billing)**
   - Click to add items directly to cart.
   - Adjust quantities with live subtotal and total updates.
   - Enter customer name and contact.
   - Clicking **Create Bill** automatically checks stock availability, deducts inventory, records an `OUT` movement, and logs the invoice.
   - Switch to the **History** tab to view past invoices and status.
4. **Inventory (Stock)**
   - Overview of all active stock levels with threshold health indicators.
   - Complete ledger of stock changes (`IN` / `OUT` / `ADJUSTMENT`) with timestamp and references.

---

## 📜 License

This project is licensed under the MIT License.
