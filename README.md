# 🐔 FlockPilot Backend

FlockPilot is a smart poultry farm management and AI-assisted decision system designed to help farmers monitor, manage, and optimize poultry operations using real-time data, automation, and intelligent insights.

This repository contains the **backend API service** built with TypeScript, Express, Prisma, and PostgreSQL.

---

# 🚀 Vision

FlockPilot is designed to evolve into a full-scale agricultural intelligence platform that provides:

- Smart poultry farm management
- AI-assisted farming insights (feeding, health, productivity)
- Real-time monitoring of flock performance
- Multi-farm and multi-user management
- Role-based access control (Farmers, Admins, Assistants)
- Scalable analytics for farm optimization

The backend is built to support both:

- A mobile-first farmer application
- A web-based admin and analytics dashboard
- AI integrations for conversational farm assistance

---

# 🧱 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT (cookie-based + token-based support)
- **Validation:** Zod
- **Security:** bcrypt password hashing, HTTP-only cookies
- **Dev Tools:** tsx / ts-node-dev (depending on setup)

---

# 📁 Project Structure

```
src/
├── config/            # Environment & app configuration
├── db/                # Prisma client setup
├── middleware/        # Auth, validation, error handling
├── modules/
│   ├── user/          # User domain (auth, profile, roles)
│   ├── auth/          # Authentication logic
│   └── farm/          # (planned) farm management module
├── utils/             # Helper utilities
├── app.ts             # Express app setup
└── server.ts          # Entry point
```

---

# 🔐 Authentication Flow

The system uses JWT-based authentication:

1. User signs up or logs in
2. Password is hashed using bcrypt
3. JWT is generated and stored in HTTP-only cookies
4. Protected routes validate token via middleware
5. User context is injected into request pipeline

---

# 🧠 Core Domain Models (Planned + Current)

## User

- Authentication identity
- Roles: FARMER, ADMIN (extensible)
- Can own multiple farms

## Farm (Planned)

- Belongs to a user
- Contains multiple flocks
- Tracks operational data

## Flock (Planned)

- Represents a group of chickens
- Tracks health, mortality, feed consumption

## Feed & Health Records (Planned)

- Daily tracking of feed usage
- Medical and vaccination records

## AI Assistant Layer (Planned)

- Context-aware farm assistant
- Uses historical farm data
- Provides recommendations and alerts

---

# 🧾 API Features

## Auth

- Signup
- Login
- Password update
- JWT-based session management

## User

- Create user
- Get profile
- Update password
- Role management (planned)

## Farm Management (Planned)

- Create farm
- Assign flocks
- Track farm performance

---

# 🛡️ Error Handling

A centralized error handling system supports:

- Zod validation errors
- Authentication errors (JWT)
- Database constraint errors (Prisma)
- Custom application errors
- Global fallback error handler

---

# 🧪 Validation

All incoming requests are validated using Zod schemas:

- Request body validation
- Params validation (planned expansion)
- Query validation (planned expansion)

Ensures type safety across the entire request lifecycle.

---

# 🗄️ Database

Powered by PostgreSQL via Prisma ORM.

Key features:

- Type-safe database queries
- Auto-generated migrations
- Schema-driven development
- Relational modeling for farms, users, and flock data

---

# 🔐 Security Considerations

- Passwords hashed with bcrypt
- JWT stored in HTTP-only cookies
- Protected route middleware (planned expansion)
- Input validation via Zod
- Duplicate prevention via DB constraints

---

# ⚙️ Environment Variables

Create a `.env` file:

```
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
PORT=8000
NODE_ENV=development
```

---

# 🧑‍💻 Development Setup

```bash
# install dependencies
pnpm install

# run dev server
pnpm dev
```

---

# 🧱 Database Setup

```bash
# generate Prisma client
pnpm prisma generate

# run migrations
pnpm prisma migrate dev
```

---

# 🧭 Roadmap

## Phase 1 (Current)

- User authentication
- JWT system
- Basic user service
- Validation layer
- Error handling system

## Phase 2

- Farm management module
- Flock tracking system
- Feed and health logging

## Phase 3

- AI assistant integration (Groq / LLM API)
- Context-aware recommendations
- Smart alerts system

## Phase 4

- Real-time analytics dashboard
- Mobile app integration
- Multi-farm scaling

---

# 🤖 AI Integration (Future Vision)

FlockPilot will integrate an AI assistant that can:

- Analyze farm performance trends
- Suggest feeding adjustments
- Predict disease risk patterns
- Answer farmer questions in natural language
- Provide operational insights using historical data

---

# 📌 Notes

This backend is intentionally designed to:

- remain modular and scalable
- support future AI expansion
- handle multi-tenant farm systems
- evolve into a production-grade agri-tech platform

---

# 📄 License

Private project — all rights reserved (for now).
