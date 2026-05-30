# 🐔 FlockPilot Backend

FlockPilot is an intelligent poultry farm management platform built to help farmers manage operations, monitor flock performance, track inventory, analyze farm health, and receive AI-assisted operational insights.

This repository contains the backend API service powering the FlockPilot ecosystem.

---

# 🚀 Overview

FlockPilot combines operational farm management with analytics and AI-powered assistance to create a modern agricultural intelligence system.

The backend currently supports:

- Multi-farm management
- Flock lifecycle tracking
- Inventory and stock movement management
- Expense and sales tracking
- Egg production and mortality monitoring
- AI-assisted farm conversations
- Insight and prediction engines
- Analytics-ready dashboard APIs

The architecture is designed to scale into a full agricultural operations platform.

---

# 🧱 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT Authentication
- **Validation:** Zod
- **AI Integration:** Groq LLM API
- **Password Security:** bcrypt
- **Package Manager:** pnpm

---

# 🧠 Core Features

## 🔐 Authentication & Authorization

- User registration
- Secure login
- JWT-based authentication
- Password hashing with bcrypt
- Protected route middleware
- Role-based architecture (extensible)

---

## 🏡 Farm Management

Farm owners can:

- Create and manage farms
- Track farm-wide operational data
- Manage multiple flocks
- Access farm analytics and AI insights

---

## 🐔 Flock Management

Track and manage poultry flocks including:

- Flock type (broiler/layer)
- Bird counts
- Flock lifecycle status
- Mortality records
- Health records
- Feed logs
- Egg production
- Flock notes

---

## 📦 Inventory Management

Advanced inventory management system with transaction-based stock tracking.

### Features

- Inventory item creation
- Opening stock support
- Stock adjustments
- Stock clearing
- Inventory archiving
- Transaction history tracking
- Low-stock monitoring
- Reorder-level support

### Transaction Types

- PURCHASE
- CONSUMPTION
- ADJUSTMENT
- LOSS
- PRODUCTION
- SALE
- REVERSAL
- OPENING_BALANCE

The system uses inventory transactions as the source of truth for stock computation.

---

## 💸 Financial Management

### Expense Tracking

Track operational expenses including:

- Feed purchases
- Medication
- Equipment
- Labor
- Maintenance
- Transport
- Utilities

### Sales Tracking

Track farm revenue from:

- Bird sales
- Egg sales
- Inventory sales

The system automatically supports operational profitability calculations.

---

# 🤖 AI Assistant System

FlockPilot includes a context-aware AI assistant powered by Groq LLM APIs.

The assistant can:

- Answer operational farm questions
- Analyze farm performance
- Detect operational risks
- Understand farm-specific context
- Use historical conversation memory
- Provide inventory, health, finance, and flock insights

---

# 🧠 AI Context Injection

The assistant dynamically injects farm-aware context including:

- Inventory health
- Financial summaries
- Flock performance
- Mortality trends
- Health records
- Operational analytics
- Predictive warnings

Intent-aware context building ensures the AI only receives relevant operational data.

---

# 📊 Analytics System

The backend exposes analytics endpoints designed for dashboard and chart integration.

## Farm Overview Analytics

Includes:

- Total birds
- Active flocks
- Mortality rate
- Financial summaries
- Profit margins
- Inventory risk detection
- Production statistics
- Operational risks

## Trend Analytics

Supports chart-ready trend data for:

- Egg production
- Mortality
- Feed consumption
- Expenses

---

# 🚨 Insight Engine

The insight engine detects operational anomalies and farm risks such as:

- Mortality spikes
- Production drops
- Inventory shortages
- Expense spikes

These insights are used by both the dashboard and AI assistant.

---

# 🔮 Prediction Engine

The prediction engine provides lightweight predictive analysis including:

- Mortality risk forecasting
- Egg production decline prediction
- Feed shortage prediction
- Inventory stockout forecasting
- Expense overrun detection

---

# 📁 Project Structure

```txt
src/
├── config/                  # App & environment configuration
├── db/                      # Prisma database client
├── generated/               # Generated Prisma client
├── lib/                     # External integrations (Groq, JWT, etc.)
├── middleware/              # Auth, validation, error handling
├── modules/
│   ├── auth/
│   ├── user/
│   ├── farm/
│   ├── flock/
│   ├── inventory/
│   ├── inventory-transaction/
│   ├── expense/
│   ├── sales/
│   ├── analytics/
│   ├── ai-assistant/
│   └── insights/
├── utils/                   # Shared utilities & analytics helpers
├── app.ts
└── server.ts
```

---

# 🗄️ Database Design

The backend uses PostgreSQL with Prisma ORM and is modeled around operational farm relationships.

Key domain models include:

- User
- Farm
- Flock
- InventoryItem
- InventoryTransaction
- Expense
- Sale
- FeedLog
- HealthRecord
- EggProduction
- MortalityRecord
- AiInteraction

---

# 🧾 API Highlights

## Authentication

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

---

## Farm Analytics

```http
GET /farms/:farmId/analytics/overview
GET /farms/:farmId/analytics/trends
```

---

## AI Assistant

```http
POST /farms/:farmId/ai-assistant/chat
```

Supports:

- conversation memory
- context-aware responses
- operational intelligence

---

# 🛡️ Validation & Error Handling

The backend includes centralized validation and error handling systems.

### Validation

Powered by Zod:

- Request body validation
- Params validation
- Query validation

### Error Handling

Handles:

- Prisma errors
- Zod validation errors
- Authentication errors
- Business logic errors
- Global fallback errors

---

# 🔐 Security

- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookie support
- Protected route middleware
- Input validation
- Duplicate inventory prevention
- Multi-tenant farm ownership validation

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
GROQ_API_KEY="your_groq_key"
PORT=8000
NODE_ENV=development
```

---

# 🧪 Development Setup

## Install dependencies

```bash
pnpm install
```

---

## Run development server

```bash
pnpm dev
```

---

# 🗄️ Prisma Setup

## Generate Prisma client

```bash
pnpm prisma generate
```

## Run migrations

```bash
pnpm prisma migrate dev
```

## Seed database

```bash
pnpm prisma db seed
```

---

# 🧭 Current System Architecture

```txt
Operational Data
        ↓
Analytics Layer
        ↓
Insight Engine
        ↓
Prediction Engine
        ↓
AI Context Injection
        ↓
AI Assistant Responses
```

---

# 📈 Future Roadmap

## Planned Improvements

- Notification system
- Real-time updates
- Scheduled AI summaries
- Advanced predictive analytics
- Multi-user farm collaboration
- Assistant action execution
- Mobile push notifications
- Offline-first mobile support
- Farm benchmarking analytics

---

# 📌 Design Philosophy

FlockPilot is intentionally designed to:

- remain modular and scalable
- support AI-native workflows
- model real farm operations
- provide actionable intelligence
- evolve into a production-grade agri-tech platform

---

# 📄 License

Private project — all rights reserved.
