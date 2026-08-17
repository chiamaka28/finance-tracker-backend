# Finance Tracker Backend

A production-ready REST API for a personal finance tracking application. Built with Express, TypeScript, Prisma ORM, and PostgreSQL.

---

## Tech Stack

- **Runtime** — Node.js 22
- **Framework** — Express 5
- **Language** — TypeScript (strict mode)
- **ORM** — Prisma 7
- **Database** — PostgreSQL (Neon)
- **Authentication** — JWT (access + refresh tokens)
- **File Uploads** — Multer
- **CSV Parsing** — csv-parse
- **Containerisation** — Docker
- **CI/CD** — GitHub Actions + Railway

---

## Features

- JWT authentication with access and refresh tokens
- Transaction management with CSV import
- Budget tracking with spending summaries
- Savings pots with deposit and withdrawal
- Recurring bills detection
- Dashboard overview aggregating all modules
- Filtering, searching, sorting, and pagination on transactions
- Duplicate import prevention via unique constraints
- DB-first data fetching with JSON file fallback

---

## Project Structure

```
src/
  modules/
    auth/           → register, login, refresh token, logout
    transaction/    → CRUD, CSV import, filtering, search, sort, pagination
    budget/         → CRUD, spending summaries per category
    pots/           → CRUD, add money, withdraw
    bills/          → recurring bills with summary stats
    overview/       → dashboard aggregation endpoint
  middleware/
    auth.ts         → JWT verification middleware
    upload.ts       → Multer file upload middleware
  data/
    data.json       → fallback transaction data
  db.ts             → Prisma client instance
  index.ts          → app entry point
prisma/
  schema.prisma     → database schema
```

---

## API Endpoints

### Auth

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/api/auth/register` | Register a new user                 |
| POST   | `/api/auth/login`    | Login and receive tokens            |
| POST   | `/api/auth/refresh`  | Refresh access token                |
| POST   | `/api/auth/logout`   | Logout and invalidate refresh token |

### Transactions

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/transactions` | Get all transactions (filter, search, sort, paginate) |
| GET | `/api/transactions/summary` | Get income, expenses and balance |
| POST | `/api/transactions/import` | Import transactions from CSV file |

#### Query Parameters

```
GET /api/transactions?category=Shopping&search=Harper&sortBy=latest&page=1&limit=10
```

| Param      | Options                                                 |
| ---------- | ------------------------------------------------------- |
| `category` | `Shopping`, `Bills`, `Entertainment`, etc.              |
| `search`   | any string (searches by name)                           |
| `sortBy`   | `latest`, `oldest`, `aToZ`, `zToA`, `highest`, `lowest` |
| `page`     | number (default: 1)                                     |
| `limit`    | number (default: 10)                                    |

### Budgets

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| GET    | `/api/budget`     | Get all budgets with spending summaries |
| POST   | `/api/budget`     | Create a budget                         |
| PATCH  | `/api/budget/:id` | Update a budget                         |
| DELETE | `/api/budget/:id` | Delete a budget                         |

### Pots

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/pot`              | Get all pots              |
| POST   | `/api/pot`              | Create a pot              |
| PATCH  | `/api/pot/:id`          | Update a pot              |
| PATCH  | `/api/pot/:id/add`      | Add money to a pot        |
| PATCH  | `/api/pot/:id/withdraw` | Withdraw money from a pot |
| DELETE | `/api/pot/:id`          | Delete a pot              |

### Recurring Bills

| Method | Endpoint     | Description                                |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/api/bills` | Get all recurring bills with summary stats |

#### Query Parameters

```
GET /api/bills?search=Netflix&sortBy=highest
```

### Overview

| Method | Endpoint        | Description                              |
| ------ | --------------- | ---------------------------------------- |
| GET    | `/api/overview` | Get dashboard summary across all modules |

---

## CSV Import Format

```csv
name,category,avatarUrl,date,amount,recurring
Harper Edwards,Shopping,./assets/images/avatars/harper-edwards.jpg,2024-07-26T09:43:23Z,-89.99,false
Sarah Mitchell,Bills,./assets/images/avatars/sarah-mitchell.jpg,2024-07-24T08:00:00Z,-120.00,true
```

**Valid categories:** `Entertainment`, `Bills`, `Groceries`, `Dining Out`, `Transportation`, `Personal Care`, `Education`, `Lifestyle`, `Shopping`, `General`

Rows with invalid categories are skipped. Duplicate rows (same name, date, and user) are ignored.

---

## Getting Started

### Prerequisites

Make sure you have the following installed before starting:

- [Node.js 22+](https://nodejs.org)
- [Yarn](https://yarnpkg.com) — `npm install -g yarn`
- [PostgreSQL](https://www.postgresql.org) database or a [Neon](https://neon.tech) account
- [Docker](https://www.docker.com/products/docker-desktop) (optional, for containerised setup)

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/chiamaka28/finance-tracker-backend.git
cd finance-tracker-backend
```

---

### Step 2 — Install dependencies

```bash
yarn install
```

---

### Step 3 — Set up environment variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Add the following variables:

```env
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

> **Note:** `DATABASE_URL` and `DIRECT_URL` can be the same value for local PostgreSQL. For Neon, they differ — `DATABASE_URL` uses the pooled connection and `DIRECT_URL` uses the direct connection.

---

### Step 4 — Run database migrations

```bash
npx prisma migrate dev
```

This creates all the tables in your database.

---

### Step 5 — Generate the Prisma client

```bash
npx prisma generate
```

---

### Step 6 — Start the development server

```bash
yarn dev
```

The server will start on `http://localhost:3000`.

You should see:

```
Server is running on port 3000
```

---

### Build for production

```bash
yarn build
node dist/index.js
```

---

## Docker

### Build

```bash
docker build -t finance-tracker .
```

### Run

```bash
docker run -p 3000:3000 --env-file .env finance-tracker
```

---

## CI/CD

- **CI** — GitHub Actions runs TypeScript checks on every push to `main`
- **CD** — Railway auto-deploys on every push to `main` using the Dockerfile

---

## Database Schema

```
User
  ├── Transactions  (one-to-many)
  ├── Budgets       (one-to-many, unique per category)
  ├── Pots          (one-to-many)
  └── RefreshToken  (one-to-many)
```

### Category Enum

`ENTERTAINMENT` · `BILLS` · `GROCERIES` · `DINING_OUT` · `TRANSPORTATION` · `PERSONAL_CARE` · `EDUCATION` · `LIFESTYLE` · `SHOPPING` · `GENERAL`

---

## Architecture

Each module follows a layered architecture:

```
Router → Middleware → Controller → Service → Database
```

- **Router** — maps URLs to controller methods
- **Middleware** — handles authentication and file uploads
- **Controller** — handles HTTP request/response
- **Service** — contains all business logic and database queries
- **DTO** — defines the shape of incoming request data
