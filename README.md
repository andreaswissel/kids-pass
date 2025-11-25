# 🎨 KidsPass

**Flexible activities for curious kids — one membership, endless options.**

Help parents discover and book kids' activities (sports, music, arts, etc.) with a single flexible subscription.

## Tech Stack

- **Next.js 16** with App Router & TypeScript
- **Tailwind CSS** with custom KidsPass theme
- **Prisma 7** with PostgreSQL (Neon)
- **NextAuth.js** for authentication
- **Stripe** for subscriptions
- **TanStack Query** for data fetching

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd kidspass
npm install
```

### 2. Set Up Environment

#### Option A: Local PostgreSQL (Docker)

```bash
# Start local database
docker-compose up -d

# Create .env.local
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://kidspass:kidspass@localhost:5432/kidspass"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret-change-in-prod"
EOF
```

#### Option B: Neon Dev Branch

1. Create a dev branch in [Neon Console](https://console.neon.tech)
2. Copy the connection string

```bash
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://user:pass@ep-xxx-dev.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret-change-in-prod"
EOF
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

After seeding, you can log in with:

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | admin@kidspass.com     | admin123   |
| Parent | emma@example.com       | parent123  |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Signup pages
│   ├── app/              # Parent dashboard & features
│   ├── admin/            # Admin dashboard
│   └── api/              # API routes
├── components/
│   ├── ui/               # Reusable UI components
│   ├── activities/       # Activity cards, filters
│   └── layout/           # Navigation, shell
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utilities
└── types/                # TypeScript types
```

---

## 🌍 Environment Variables

### Local Development (`.env.local`)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-secret-for-local"
```

### Production (Vercel Dashboard)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon production connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (optional) |

---

## 🗄️ Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema (dev)
npm run db:migrate   # Create migration (prod)
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

---

## 📱 Features

### Parent App
- ✅ Activity discovery with filters
- ✅ Activity details & booking
- ✅ Schedule management
- ✅ Child profile management
- ✅ Subscription & billing

### Admin Dashboard
- ✅ Partner management
- ✅ Activity management
- ✅ Session scheduling
- ✅ Booking overview
- ✅ User management

---

## 🎨 Design

The UI is inspired by a playful, child-friendly aesthetic:
- Warm cream backgrounds
- Golden yellow CTAs
- Cute animal illustrations (fox, rabbit, bear, dog, panda)
- Soft pastel category colors
- Rounded corners throughout

---

## 📄 License

MIT
