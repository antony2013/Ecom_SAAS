# SaaS E-commerce Platform

Multi-tenant headless e-commerce platform built with **Fastify v5**, **Drizzle ORM**, **PostgreSQL**, and **Redis**. Supports multiple independent stores on a single deployment with full tenant isolation.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Fastify v5                     │
├─────────┬──────────┬──────────┬────────────────┤
│  Public │ Merchant  │ Customer  │   SuperAdmin   │
│  Scope  │  Scope   │  Scope    │    Scope       │
│ (browse)│ (manage)  │ (shop)    │  (platform)    │
├─────────┴──────────┴──────────┴────────────────┤
│              Shared Service Layer                │
│  auth · store · product · order · cache · queue │
├─────────────────────────────────────────────────┤
│         PostgreSQL    │    Redis (ioredis)       │
│       (Drizzle ORM)   │   (cache + BullMQ)      │
└─────────────────────────────────────────────────┘
```

### Four Authentication Scopes

| Scope | Prefix | Auth | Purpose |
|---|---|---|---|
| **Public** | `/api/v1/public` | None | Storefront browsing, cart, product search |
| **Merchant** | `/api/v1/merchant` | JWT (storeId + userId) | Store management, products, orders |
| **Customer** | `/api/v1/customer` | JWT (customerId + storeId) | Wishlist, orders, reviews, checkout |
| **SuperAdmin** | `/api/v1/admin` | JWT (superAdminId) | Platform admin, merchant approval, plans |

Each scope is a Fastify encapsulated context with its own `onRequest` auth hook. Hooks skip only login/register/logout routes — all other routes (including `/me`) are protected.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22+ |
| Framework | Fastify | v5.8+ |
| ORM | Drizzle ORM | v0.45+ |
| Database | PostgreSQL | 16 |
| Cache/Queue | Redis (ioredis + BullMQ) | v5 |
| Validation | Zod | v4 |
| Auth | @fastify/jwt + httpOnly cookies | v10 |
| Language | TypeScript (ESM) | v5.8+ |
| Build | Turborepo + pnpm | monorepo |
| File Upload | @fastify/multipart | v10 |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Docker & Docker Compose
- Git

### 1. Clone & Install

```bash
git clone https://github.com/arokyaillam/Ecom_New.git
cd Ecom_New
pnpm install
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Configure Environment

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
```

Generate a JWT secret:

```bash
openssl rand -base64 48
```

Update `JWT_SECRET` in `apps/backend/.env` with the generated value.

### 4. Run Database Migrations

```bash
cd apps/backend
pnpm db:migrate
```

### 5. Seed the Database

```bash
pnpm db:seed
```

This creates test data including:

| Account | Email | Password |
|---|---|---|
| Super Admin | admin@saasplatform.com | Admin1234 |
| Store Owner | owner@techgear.com | Merchant1234 |
| Store Staff | staff@techgear.com | Merchant1234 |
| Customer | john@example.com | Customer1234 |
| Customer | fatima@example.com | Customer1234 |

### 6. Start Development Server

```bash
pnpm dev
```

Server runs at `http://localhost:3000`

### 7. Verify

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"...","uptime":...}

curl http://localhost:3000/health/ready
# {"status":"ready"}
```

## API Endpoints

### Public (no auth)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/public/store` | Store info (by Host header) |
| GET | `/api/v1/public/products` | Published products |
| GET | `/api/v1/public/products/:id` | Single product |
| GET | `/api/v1/public/reviews/product/:id` | Product reviews |
| GET | `/api/v1/public/analytics` | Limited public stats |
| GET/POST/PATCH/DELETE | `/api/v1/public/cart[/*]` | Guest cart (cookie-based) |

### Merchant (JWT auth)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/merchant/auth/login` | Login |
| POST | `/api/v1/merchant/auth/register` | Register store |
| POST | `/api/v1/merchant/auth/logout` | Logout |
| GET | `/api/v1/merchant/auth/me` | Current user |
| GET/PATCH | `/api/v1/merchant/store` | Store settings |
| CRUD | `/api/v1/merchant/products[/*]` | Products + variants + options |
| CRUD | `/api/v1/merchant/categories[/*]` | Categories + subcategories |
| CRUD | `/api/v1/merchant/modifiers[/*]` | Modifier groups + options |
| GET/PATCH/DELETE | `/api/v1/merchant/orders[/*]` | Order management |
| GET | `/api/v1/merchant/customers` | Customer list |
| GET/PATCH/DELETE | `/api/v1/merchant/reviews[/*]` | Review moderation |
| CRUD | `/api/v1/merchant/coupons[/*]` | Coupon management |
| GET | `/api/v1/merchant/analytics/dashboard` | Dashboard stats |
| GET | `/api/v1/merchant/analytics/revenue` | Revenue data |
| POST | `/api/v1/merchant/upload` | File upload |

### Customer (JWT auth)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/customer/auth/login` | Login |
| POST | `/api/v1/customer/auth/register` | Register |
| POST | `/api/v1/customer/auth/logout` | Logout |
| GET | `/api/v1/customer/auth/me` | Profile |
| GET/PATCH | `/api/v1/customer/profile` | Profile management |
| GET | `/api/v1/customer/orders` | Order history |
| GET | `/api/v1/customer/orders/:id` | Order detail |
| POST | `/api/v1/customer/checkout` | Place order |
| GET/POST/DELETE | `/api/v1/customer/wishlist[/*]` | Wishlist |
| CRUD | `/api/v1/customer/reviews[/*]` | Reviews |

### SuperAdmin (JWT auth)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/auth/login` | Login |
| POST | `/api/v1/admin/auth/logout` | Logout |
| GET | `/api/v1/admin/auth/me` | Current admin |
| GET | `/api/v1/admin/merchants` | List stores |
| GET | `/api/v1/admin/merchants/:id` | Store detail |
| PATCH | `/api/v1/admin/merchants/:id/approve` | Approve store |
| PATCH | `/api/v1/admin/merchants/:id/suspend` | Suspend store |
| PATCH | `/api/v1/admin/merchants/:id/reactivate` | Reactivate store |
| CRUD | `/api/v1/admin/plans[/*]` | Plan management |
| GET/PATCH | `/api/v1/admin/stores[/*]` | Store management |
| GET | `/api/v1/admin/stores/stats` | Platform statistics |

## Project Structure

```
apps/backend/src/
├── config/
│   └── env.ts                  # Zod-validated env vars
├── db/
│   ├── schema.ts               # Drizzle schema (24 tables)
│   ├── seed.ts                 # Comprehensive seed script
│   └── index.ts                # DB connection
├── errors/
│   └── codes.ts                # Standardized error codes
├── plugins/
│   ├── cors.ts                 # @fastify/cors
│   ├── jwt.ts                  # @fastify/jwt
│   ├── redis.ts                # ioredis connection
│   ├── rateLimit.ts            # @fastify/rate-limit
│   ├── swagger.ts              # @fastify/swagger
│   ├── multipart.ts            # @fastify/multipart
│   ├── compress.ts             # @fastify/compress
│   ├── helmet.ts               # @fastify/helmet
│   ├── sensible.ts             # @fastify/sensible
│   └── index.ts                # Plugin registry
├── scopes/
│   ├── public.ts               # Public scope (no auth)
│   ├── merchant.ts             # Merchant scope + auth hook
│   ├── customer.ts             # Customer scope + auth hook
│   └── superAdmin.ts           # SuperAdmin scope + auth hook
├── routes/
│   ├── public/                 # Store, products, reviews, cart, analytics
│   ├── merchant/               # Auth, store, products, categories, modifiers,
│   │                           # orders, customers, reviews, coupons, analytics, upload
│   ├── customer/               # Auth, profile, orders, checkout, wishlist, reviews
│   └── superAdmin/             # Auth, merchants, plans, stores
├── services/
│   ├── auth.service.ts         # Password hashing, JWT verification
│   ├── store.service.ts        # Store CRUD
│   ├── product.service.ts      # Product CRUD + variants
│   ├── order.service.ts        # Order management
│   ├── customer.service.ts     # Customer management
│   ├── category.service.ts     # Category CRUD
│   ├── modifier.service.ts     # Modifier groups
│   ├── review.service.ts       # Review management
│   ├── coupon.service.ts       # Coupon validation
│   ├── analytics.service.ts    # Dashboard + revenue stats
│   ├── superAdmin.service.ts   # Platform admin operations
│   ├── upload.service.ts       # File upload validation
│   ├── cache.service.ts        # Redis caching (getOrSet)
│   ├── queue.service.ts        # BullMQ job queues
│   ├── email.service.ts        # Resend email
│   └── index.ts                # Service barrel export
├── types/
│   └── fastify.d.ts            # Request type augmentation
├── seed-superadmin.ts          # SuperAdmin-only seed script
└── index.ts                    # App entry (≤60 lines)
```

## Security

- **JWT in httpOnly cookies** — tokens never exposed to JavaScript
- **Tenant isolation** — storeId from JWT only, never from request body
- **Scope encapsulation** — auth hooks scoped to their routes only
- **Zod `strictObject()`** — rejects unknown keys on all route bodies
- **Helmet + CORS** — security headers configured
- **Rate limiting** — per-IP throttling via @fastify/rate-limit
- **Error codes** — standardized `ErrorCodes` for programmatic handling
- **Password leak prevention** — `columns: {...}` pattern excludes passwords from relations
- **Cross-tenant protection** — storeId filter on all data mutations

## Database Schema

24 tables covering the full e-commerce domain:

`superAdmins` · `merchantPlans` · `stores` · `users` · `categories` · `subcategories` · `products` · `productVariants` · `productVariantOptions` · `productVariantCombinations` · `modifierGroups` · `modifierOptions` · `customers` · `customerAddresses` · `orders` · `orderItems` · `reviews` · `wishlists` · `carts` · `cartItems` · `coupons` · `emailTemplates` · `activityLogs` · `storeAnalytics`

Run Drizzle Studio to explore:

```bash
cd apps/backend && pnpm db:studio
```

## Scripts

```bash
# Development
pnpm dev                  # Start dev server with hot reload

# Database
pnpm db:generate          # Generate migration from schema changes
pnpm db:migrate           # Run pending migrations
pnpm db:seed              # Seed database with test data
pnpm db:studio            # Open Drizzle Studio

# Code Quality
pnpm typecheck            # TypeScript type checking (no emit)

# Seed SuperAdmin only (without full seed data)
cd apps/backend && npx tsx src/seed-superadmin.ts
```

## Multi-Tenant Setup

Stores are resolved via the `Host` header:

```
# Request to techgear.localhost:3000
GET /api/v1/public/products
Host: techgear.localhost:3000
→ Resolves to TechGear Pro store

# Request to fashionhouse.localhost:3000
GET /api/v1/public/products
Host: fashionhouse.localhost:3000
→ Resolves to Fashion House store
```

For local development, add entries to `/etc/hosts`:

```
127.0.0.1 techgear.localhost
127.0.0.1 fashionhouse.localhost
```

## License

Private — All rights reserved.