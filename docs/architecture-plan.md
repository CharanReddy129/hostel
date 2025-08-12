# Hostel/PG Management SaaS - Architecture Plan

## System Overview

This document outlines the technical architecture for a multi-tenant Hostel/PG Management SaaS platform using modern web technologies with a self-hosted deployment approach.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios with React Query
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod
- **File Upload**: Multer + S3-compatible storage
- **Email**: Nodemailer
- **Background Jobs**: Bull with Redis

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Cache**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + Loki

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Next.js Web App]
        MOBILE[Mobile Web]
    end
    
    subgraph "Reverse Proxy"
        NGINX[Nginx]
    end
    
    subgraph "Application Layer"
        API[Express API Server]
        NEXT[Next.js Server]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        REDIS[(Redis Cache)]
        MINIO[MinIO Storage]
    end
    
    subgraph "Background Services"
        BULL[Bull Queue]
        CRON[Cron Jobs]
    end
    
    WEB --> NGINX
    MOBILE --> NGINX
    NGINX --> API
    NGINX --> NEXT
    API --> PG
    API --> REDIS
    API --> MINIO
    API --> BULL
    BULL --> REDIS
    CRON --> API
```

## Database Schema Design

```mermaid
erDiagram
    Organization ||--o{ Hostel : owns
    Organization ||--o{ User : has
    User ||--o{ UserRole : has
    Hostel ||--o{ Room : contains
    Hostel ||--o{ Notice : posts
    Room ||--o{ Bed : contains
    Bed ||--o{ TenantStay : occupied_by
    User ||--o{ TenantStay : stays_in
    
    Organization {
        uuid id PK
        string name
        string subdomain UK
        json settings
        timestamp created_at
        timestamp updated_at
    }
    
    User {
        uuid id PK
        uuid organization_id FK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    UserRole {
        uuid id PK
        uuid user_id FK
        uuid hostel_id FK "nullable"
        enum role "ADMIN|OWNER|TENANT"
        timestamp created_at
    }
    
    Hostel {
        uuid id PK
        uuid organization_id FK
        string name
        string address
        json contact_info
        integer total_beds
        timestamp created_at
        timestamp updated_at
    }
    
    Room {
        uuid id PK
        uuid hostel_id FK
        string room_number
        string floor
        enum room_type
        integer capacity
        json amenities
        timestamp created_at
        timestamp updated_at
    }
    
    Bed {
        uuid id PK
        uuid room_id FK
        string bed_number
        enum status "VACANT|OCCUPIED|MAINTENANCE"
        decimal monthly_rent
        timestamp created_at
        timestamp updated_at
    }
    
    TenantStay {
        uuid id PK
        uuid user_id FK
        uuid bed_id FK
        date check_in_date
        date check_out_date "nullable"
        enum status "ACTIVE|COMPLETED"
        json emergency_contact
        timestamp created_at
        timestamp updated_at
    }
    
    Notice {
        uuid id PK
        uuid hostel_id FK
        uuid created_by FK
        string title
        text content
        enum priority "LOW|MEDIUM|HIGH"
        timestamp created_at
        timestamp updated_at
    }
```

## API Architecture

### RESTful Endpoints Structure

```
/api/v1/
├── auth/
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   └── POST   /forgot-password
├── organizations/
│   ├── GET    /current
│   └── PUT    /:id
├── users/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── DELETE /:id
├── hostels/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   └── POST   /:id/assign-owner
├── rooms/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── DELETE /:id
├── beds/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   └── PUT    /:id/status
├── tenants/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── POST   /:id/check-out
├── notices/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── DELETE /:id
└── reports/
    ├── GET    /occupancy
    ├── GET    /revenue
    └── GET    /tenant-history
```

## Security Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    participant Redis
    
    Client->>API: POST /auth/login (email, password)
    API->>DB: Verify credentials
    DB-->>API: User data
    API->>API: Generate JWT tokens
    API->>Redis: Store refresh token
    API-->>Client: Access token + Refresh token
    
    Client->>API: GET /api/resource (Bearer token)
    API->>API: Verify JWT
    API-->>Client: Protected resource
    
    Client->>API: POST /auth/refresh (Refresh token)
    API->>Redis: Verify refresh token
    Redis-->>API: Token valid
    API->>API: Generate new access token
    API-->>Client: New access token
```

### Role-Based Access Control (RBAC)

```typescript
// Permission Matrix
const permissions = {
  ADMIN: {
    hostel: ['create', 'read', 'update', 'delete'],
    room: ['create', 'read', 'update', 'delete'],
    bed: ['create', 'read', 'update', 'delete'],
    tenant: ['create', 'read', 'update', 'delete'],
    owner: ['create', 'read', 'update', 'delete'],
    notice: ['create', 'read', 'update', 'delete'],
    report: ['read']
  },
  OWNER: {
    hostel: ['read'],
    room: ['create', 'read', 'update', 'delete'],
    bed: ['create', 'read', 'update', 'delete'],
    tenant: ['create', 'read', 'update'],
    notice: ['create', 'read', 'update', 'delete'],
    report: ['read']
  },
  TENANT: {
    profile: ['read', 'update'],
    stay: ['read'],
    notice: ['read']
  }
};
```

## Frontend Architecture

### Component Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── hostels/
│   │   ├── rooms/
│   │   ├── beds/
│   │   ├── tenants/
│   │   └── notices/
│   └── (tenant)/
│       ├── profile/
│       └── notices/
├── components/
│   ├── ui/           # Shadcn components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── OccupancyChart.tsx
│   │   └── RecentActivity.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── SearchFilter.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── api/          # API client functions
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── validators/   # Zod schemas
└── store/           # Zustand stores
```

### State Management Strategy

```typescript
// Example Zustand store structure
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface HostelStore {
  hostels: Hostel[];
  selectedHostel: Hostel | null;
  isLoading: boolean;
  fetchHostels: () => Promise<void>;
  createHostel: (data: CreateHostelDto) => Promise<void>;
  updateHostel: (id: string, data: UpdateHostelDto) => Promise<void>;
  deleteHostel: (id: string) => Promise<void>;
}
```

## Deployment Architecture

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/hostel_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - MINIO_ENDPOINT=minio:9000
    depends_on:
      - postgres
      - redis
      - minio

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=hostel_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

## Performance Optimization Strategies

1. **Database Optimization**
   - Implement database indexing on frequently queried fields
   - Use database connection pooling
   - Implement query result caching with Redis

2. **API Optimization**
   - Implement response compression
   - Use pagination for list endpoints
   - Implement request rate limiting
   - Cache frequently accessed data

3. **Frontend Optimization**
   - Implement code splitting
   - Use Next.js Image optimization
   - Implement lazy loading for components
   - Use React Query for efficient data fetching and caching

## Monitoring and Observability

```mermaid
graph LR
    APP[Application] --> METRICS[Prometheus]
    APP --> LOGS[Loki]
    METRICS --> GRAFANA[Grafana]
    LOGS --> GRAFANA
    GRAFANA --> ALERTS[Alert Manager]
```

## Development Workflow

1. **Local Development**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Run database migrations
   docker-compose exec backend npm run prisma:migrate
   
   # Seed database
   docker-compose exec backend npm run seed
   ```

2. **Testing Strategy**
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Performance tests for load handling

3. **CI/CD Pipeline**
   - Automated testing on pull requests
   - Code quality checks (ESLint, Prettier)
   - Security scanning
   - Automated deployment to staging/production

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design for easy scaling
   - Session management in Redis
   - Load balancing with Nginx

2. **Database Scaling**
   - Read replicas for reporting
   - Database partitioning by organization
   - Archival strategy for old data

3. **Caching Strategy**
   - Redis for session management
   - API response caching
   - Static asset caching with CDN

## Security Best Practices

1. **Application Security**
   - Input validation and sanitization
   - SQL injection prevention with Prisma
   - XSS protection
   - CSRF protection
   - Rate limiting

2. **Infrastructure Security**
   - SSL/TLS encryption
   - Secure environment variables
   - Regular security updates
   - Backup and disaster recovery

3. **Data Privacy