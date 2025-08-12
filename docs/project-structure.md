# Hostel/PG Management SaaS - Project Structure

## Complete Project Structure

```
hostel-management-saas/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router
│   │   │   ├── (auth)/        # Auth group route
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/   # Admin/Owner dashboard
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── hostels/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── beds/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── tenants/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── notices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx
│   │   │   ├── (tenant)/      # Tenant portal
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── stay-history/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── notices/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── navbar.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── mobile-nav.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── occupancy-chart.tsx
│   │   │   │   ├── revenue-chart.tsx
│   │   │   │   ├── recent-activity.tsx
│   │   │   │   └── quick-actions.tsx
│   │   │   ├── hostels/
│   │   │   │   ├── hostel-table.tsx
│   │   │   │   ├── hostel-form.tsx
│   │   │   │   ├── assign-owner-modal.tsx
│   │   │   │   └── hostel-card.tsx
│   │   │   ├── rooms/
│   │   │   │   ├── room-list.tsx
│   │   │   │   ├── room-card.tsx
│   │   │   │   ├── room-form.tsx
│   │   │   │   └── bed-allocation.tsx
│   │   │   ├── tenants/
│   │   │   │   ├── tenant-table.tsx
│   │   │   │   ├── tenant-form.tsx
│   │   │   │   ├── tenant-profile.tsx
│   │   │   │   └── check-out-modal.tsx
│   │   │   ├── notices/
│   │   │   │   ├── notice-list.tsx
│   │   │   │   ├── notice-form.tsx
│   │   │   │   └── notice-card.tsx
│   │   │   └── shared/
│   │   │       ├── data-table.tsx
│   │   │       ├── search-filter.tsx
│   │   │       ├── loading-spinner.tsx
│   │   │       ├── error-boundary.tsx
│   │   │       └── status-badge.tsx
│   │   ├── lib/
│   │   │   ├── api/           # API client functions
│   │   │   │   ├── auth.ts
│   │   │   │   ├── hostels.ts
│   │   │   │   ├── rooms.ts
│   │   │   │   ├── beds.ts
│   │   │   │   ├── tenants.ts
│   │   │   │   ├── notices.ts
│   │   │   │   └── client.ts
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-hostels.ts
│   │   │   │   ├── use-rooms.ts
│   │   │   │   ├── use-tenants.ts
│   │   │   │   └── use-debounce.ts
│   │   │   ├── utils/         # Utility functions
│   │   │   │   ├── cn.ts
│   │   │   │   ├── format.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── helpers.ts
│   │   │   └── validators/    # Zod schemas
│   │   │       ├── auth.ts
│   │   │       ├── hostel.ts
│   │   │       ├── room.ts
│   │   │       ├── tenant.ts
│   │   │       └── common.ts
│   │   ├── store/            # Zustand stores
│   │   │   ├── auth-store.ts
│   │   │   ├── hostel-store.ts
│   │   │   ├── tenant-store.ts
│   │   │   └── ui-store.ts
│   │   └── types/            # TypeScript types
│   │       ├── api.ts
│   │       ├── models.ts
│   │       └── index.ts
│   ├── public/               # Static assets
│   │   ├── images/
│   │   └── fonts/
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── components.json       # Shadcn config
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                   # Express.js API
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── minio.ts
│   │   │   └── index.ts
│   │   ├── controllers/      # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── hostel.controller.ts
│   │   │   ├── room.controller.ts
│   │   │   ├── bed.controller.ts
│   │   │   ├── tenant.controller.ts
│   │   │   ├── notice.controller.ts
│   │   │   └── report.controller.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── models/           # Prisma models (generated)
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── hostel.routes.ts
│   │   │   ├── room.routes.ts
│   │   │   ├── bed.routes.ts
│   │   │   ├── tenant.routes.ts
│   │   │   ├── notice.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   └── index.ts
│   │   ├── services/         # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── hostel.service.ts
│   │   │   ├── room.service.ts
│   │   │   ├── bed.service.ts
│   │   │   ├── tenant.service.ts
│   │   │   ├── notice.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── storage.service.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   ├── validators/       # Zod schemas
│   │   │   ├── auth.validator.ts
│   │   │   ├── hostel.validator.ts
│   │   │   ├── room.validator.ts
│   │   │   ├── tenant.validator.ts
│   │   │   └── common.validator.ts
│   │   ├── jobs/            # Background jobs
│   │   │   ├── email.job.ts
│   │   │   ├── cleanup.job.ts
│   │   │   └── index.ts
│   │   ├── types/           # TypeScript types
│   │   │   ├── express.d.ts
│   │   │   └── index.ts
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed.ts         # Database seeding
│   ├── tests/              # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── nginx/                   # Nginx configuration
│   ├── nginx.conf
│   ├── conf.d/
│   │   └── default.conf
│   └── ssl/                # SSL certificates
│
├── docker/                  # Docker configurations
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
│
├── scripts/                 # Utility scripts
│   ├── setup.sh
│   ├── backup.sh
│   └── deploy.sh
│
├── docs/                    # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── TROUBLESHOOTING.md
│
├── .github/                 # GitHub configurations
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .gitignore
├── README.md
└── LICENSE
```

## Key Configuration Files

### Frontend Configuration Files

#### `frontend/package.json`
```json
{
  "name": "hostel-management-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.9.0",
    "lucide-react": "^0.290.0",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0",
    "prettier": "^3.0.0"
  }
}
```

#### `frontend/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### Backend Configuration Files

#### `backend/package.json`
```json
{
  "name": "hostel-management-backend",
  "version": "1.0.0",
  "description": "Backend API for Hostel Management SaaS",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.0",
    "winston": "^3.11.0",
    "bull": "^4.11.0",
    "ioredis": "^5.3.0",
    "multer": "^1.4.5-lts.1",
    "minio": "^7.1.0",
    "nodemailer": "^6.9.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/cors": "^2.8.0",
    "@types/compression": "^1.7.0",
    "@types/multer": "^1.4.0",
    "@types/nodemailer": "^6.4.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "prisma": "^5.6.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

#### `backend/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  subdomain String   @unique
  settings  Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users   User[]
  hostels Hostel[]
}

model User {
  id             String   @id @default(uuid())
  organizationId String
  email          String   @unique
  passwordHash   String
  firstName      String
  lastName       String
  phone          String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  roles        UserRole[]
  tenantStays  TenantStay[]
  notices      Notice[]
}

model UserRole {
  id        String   @id @default(uuid())
  userId    String
  hostelId  String?
  role      Role
  createdAt DateTime @default(now())

  user   User    @relation(fields: [userId], references: [id])
  hostel Hostel? @relation(fields: [hostelId], references: [id])

  @@unique([userId, hostelId, role])
}

enum Role {
  ADMIN
  OWNER
  TENANT
}

model Hostel {
  id             String   @id @default(uuid())
  organizationId String
  name           String
  address        String
  contactInfo    Json     @default("{}")
  totalBeds      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  rooms        Room[]
  notices      Notice[]
  userRoles    UserRole[]
}

model Room {
  id        String   @id @default(uuid())
  hostelId  String
  roomNumber String
  floor     String
  roomType  RoomType
  capacity  Int
  amenities Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  hostel Hostel @relation(fields: [hostelId], references: [id])
  beds   Bed[]

  @@unique([hostelId, roomNumber])
}

enum RoomType {
  SINGLE
  DOUBLE
  TRIPLE
  DORMITORY
}

model Bed {
  id          String    @id @default(uuid())
  roomId      String
  bedNumber   String
  status      BedStatus @default(VACANT)
  monthlyRent Decimal   @db.Decimal(10, 2)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  room        Room         @relation(fields: [roomId], references: [id])
  tenantStays TenantStay[]

  @@unique([roomId, bedNumber])
}

enum BedStatus {
  VACANT
  OCCUPIED
  MAINTENANCE
}

model TenantStay {
  id               String     @id @default(uuid())
  userId           String
  bedId            String
  checkInDate      DateTime
  checkOutDate     DateTime?
  status           StayStatus @default(ACTIVE)
  emergencyContact Json       @default("{}")
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  user User @relation(fields: [userId], references: [id])
  bed  Bed  @relation(fields: [bedId], references: [id])
}

enum StayStatus {
  ACTIVE
  COMPLETED
}

model Notice {
  id        String         @id @default(uuid())
  hostelId  String
  createdBy String
  title     String
  content   String         @db.Text
  priority  NoticePriority @default(MEDIUM)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  hostel Hostel @relation(fields: [hostelId], references: [id])
  author User   @relation(fields: [createdBy], references: [id])
}

enum NoticePriority {
  LOW
  MEDIUM
  HIGH
}
```

### Docker Configuration

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  nginx:
    build: ./nginx
    container_name: hostel_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - hostel_network

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hostel_frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000/api/v1
    depends_on:
      - backend
    networks:
      - hostel_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hostel_backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://hostel_user:hostel_pass@postgres:5432/hostel_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - MINIO_ENDPOINT=minio
      - MINIO_PORT=9000
      - MINIO_ACCESS_KEY=minioadmin
      - MINIO_SECRET_KEY=minioadmin
      - MINIO_USE_SSL=false
    depends_on:
      - postgres
      - redis
      - minio
    networks:
      - hostel_network

  postgres:
    image: postgres:15-alpine
    container_name: hostel_postgres
    environment:
      - POSTGRES_USER=hostel_user
      - POSTGRES_PASSWORD=hostel_pass
      - POSTGRES_DB=hostel_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - hostel_network

  redis:
    image: redis:7-alpine
    container_name: hostel_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - hostel_network

  minio:
    image: minio/minio:latest
    container_name: hostel_minio
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - hostel_network

  # Optional: Database management tool
  adminer:
    image: adminer:latest
    container_name: hostel_adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - hostel_network

networks:
  hostel_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

## Environment Variables

### Frontend `.env.local`
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Hostel Management System
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false
```

### Backend `.env`
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://hostel_user:hostel_pass@localhost:5432/hostel_db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=hostel-uploads

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hostelmanagement.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development Scripts

### `scripts/setup.sh`
```bash
#!/bin/bash

echo "Setting up Hostel Management SaaS..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd ../backend && npm install

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "Running database migrations..."
docker-compose up -d postgres
sleep 5
npm run prisma:migrate

# Seed database
echo "Seeding database..."
npm run seed

echo "Setup complete! Run 'docker-compose up' to start the application."
```

This project structure provides a solid foundation for building the Hostel/PG Management SaaS platform with clear separation of concerns, scalability, and maintainability in mind.