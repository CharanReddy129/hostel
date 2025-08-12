# Hostel/PG Management SaaS - API Design Documentation

## API Overview

Base URL: `https://api.hostelmanagement.com/api/v1`

### API Principles
- RESTful design patterns
- JSON request/response format
- JWT-based authentication
- Consistent error handling
- Pagination for list endpoints
- Rate limiting per endpoint
- API versioning in URL

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securePassword123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["ADMIN"],
      "organizationId": "uuid"
    },
    "tokens": {
      "accessToken": "jwt.access.token",
      "refreshToken": "jwt.refresh.token",
      "expiresIn": 900
    }
  }
}

Response 401:
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt.refresh.token"
}

Response 200:
{
  "success": true,
  "data": {
    "accessToken": "new.jwt.access.token",
    "expiresIn": 900
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Organization Management

### Get Current Organization
```http
GET /organizations/current
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC Hostels",
    "subdomain": "abc-hostels",
    "settings": {
      "currency": "INR",
      "timezone": "Asia/Kolkata",
      "dateFormat": "DD/MM/YYYY"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Organization
```http
PUT /organizations/:id
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "name": "ABC Hostels Updated",
  "settings": {
    "currency": "USD",
    "timezone": "America/New_York"
  }
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC Hostels Updated",
    "subdomain": "abc-hostels",
    "settings": {
      "currency": "USD",
      "timezone": "America/New_York",
      "dateFormat": "DD/MM/YYYY"
    },
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

## User Management

### List Users
```http
GET /users?page=1&limit=20&role=OWNER&search=john
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Smith",
        "phone": "+1234567890",
        "isActive": true,
        "roles": [
          {
            "role": "OWNER",
            "hostelId": "uuid",
            "hostelName": "Hostel A"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### Create User
```http
POST /users
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roles": [
    {
      "role": "OWNER",
      "hostelId": "uuid"
    }
  ]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isActive": true,
    "roles": [
      {
        "role": "OWNER",
        "hostelId": "uuid",
        "hostelName": "Hostel A"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User
```http
PUT /users/:id
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "firstName": "Jane Updated",
  "phone": "+0987654321",
  "isActive": false
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "firstName": "Jane Updated",
    "lastName": "Doe",
    "phone": "+0987654321",
    "isActive": false,
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

## Hostel Management

### List Hostels
```http
GET /hostels?page=1&limit=10&search=downtown
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "hostels": [
      {
        "id": "uuid",
        "name": "Downtown Hostel",
        "address": "123 Main St, City",
        "contactInfo": {
          "phone": "+1234567890",
          "email": "downtown@hostels.com",
          "manager": "John Manager"
        },
        "totalBeds": 100,
        "occupiedBeds": 85,
        "vacantBeds": 15,
        "occupancyRate": 85,
        "owners": [
          {
            "id": "uuid",
            "name": "John Smith",
            "email": "john@example.com"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Create Hostel
```http
POST /hostels
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "name": "New City Hostel",
  "address": "456 Park Ave, City",
  "contactInfo": {
    "phone": "+1234567890",
    "email": "newcity@hostels.com",
    "manager": "Jane Manager"
  }
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New City Hostel",
    "address": "456 Park Ave, City",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "newcity@hostels.com",
      "manager": "Jane Manager"
    },
    "totalBeds": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Hostel Details
```http
GET /hostels/:id
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Downtown Hostel",
    "address": "123 Main St, City",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "downtown@hostels.com",
      "manager": "John Manager"
    },
    "totalBeds": 100,
    "occupiedBeds": 85,
    "vacantBeds": 15,
    "occupancyRate": 85,
    "statistics": {
      "totalRooms": 25,
      "totalTenants": 85,
      "monthlyRevenue": 850000,
      "averageStayDuration": 180
    },
    "owners": [
      {
        "id": "uuid",
        "name": "John Smith",
        "email": "john@example.com"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Assign Owner to Hostel
```http
POST /hostels/:id/assign-owner
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "userId": "uuid"
}

Response 200:
{
  "success": true,
  "message": "Owner assigned successfully",
  "data": {
    "hostelId": "uuid",
    "userId": "uuid",
    "role": "OWNER"
  }
}
```

## Room Management

### List Rooms
```http
GET /rooms?hostelId=uuid&floor=2&status=VACANT&page=1&limit=20
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "uuid",
        "hostelId": "uuid",
        "hostelName": "Downtown Hostel",
        "roomNumber": "201",
        "floor": "2",
        "roomType": "DOUBLE",
        "capacity": 2,
        "occupiedBeds": 0,
        "vacantBeds": 2,
        "amenities": ["AC", "WiFi", "Attached Bathroom"],
        "status": "VACANT",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### Create Room
```http
POST /rooms
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "hostelId": "uuid",
  "roomNumber": "301",
  "floor": "3",
  "roomType": "TRIPLE",
  "capacity": 3,
  "amenities": ["AC", "WiFi", "Study Table"]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "hostelId": "uuid",
    "roomNumber": "301",
    "floor": "3",
    "roomType": "TRIPLE",
    "capacity": 3,
    "amenities": ["AC", "WiFi", "Study Table"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## Bed Management

### List Beds
```http
GET /beds?roomId=uuid&status=VACANT&page=1&limit=20
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "beds": [
      {
        "id": "uuid",
        "roomId": "uuid",
        "roomNumber": "201",
        "bedNumber": "201-A",
        "status": "VACANT",
        "monthlyRent": 10000,
        "currentTenant": null,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Create Bed
```http
POST /beds
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "roomId": "uuid",
  "bedNumber": "301-A",
  "monthlyRent": 12000
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "roomId": "uuid",
    "bedNumber": "301-A",
    "status": "VACANT",
    "monthlyRent": 12000,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Bed Status
```http
PUT /beds/:id/status
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "status": "MAINTENANCE",
  "reason": "Bed repair required"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "MAINTENANCE",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

## Tenant Management

### List Tenants
```http
GET /tenants?hostelId=uuid&status=ACTIVE&page=1&limit=20&search=john
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "userId": "uuid",
        "firstName": "John",
        "lastName": "Tenant",
        "email": "john.tenant@example.com",
        "phone": "+1234567890",
        "currentStay": {
          "id": "uuid",
          "bedId": "uuid",
          "bedNumber": "201-A",
          "roomNumber": "201",
          "hostelName": "Downtown Hostel",
          "checkInDate": "2024-01-01",
          "monthlyRent": 10000,
          "status": "ACTIVE"
        },
        "emergencyContact": {
          "name": "Jane Doe",
          "phone": "+0987654321",
          "relation": "Sister"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 85,
      "totalPages": 5
    }
  }
}
```

### Create Tenant (Check-in)
```http
POST /tenants
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "email": "newtenant@example.com",
  "password": "tempPassword123",
  "firstName": "New",
  "lastName": "Tenant",
  "phone": "+1234567890",
  "bedId": "uuid",
  "checkInDate": "2024-01-15",
  "emergencyContact": {
    "name": "Emergency Contact",
    "phone": "+0987654321",
    "relation": "Parent"
  }
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "newtenant@example.com",
      "firstName": "New",
      "lastName": "Tenant"
    },
    "stay": {
      "id": "uuid",
      "bedId": "uuid",
      "checkInDate": "2024-01-15",
      "status": "ACTIVE"
    }
  }
}
```

### Tenant Check-out
```http
POST /tenants/:id/check-out
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "checkOutDate": "2024-06-15",
  "reason": "Relocation",
  "feedback": "Great experience"
}

Response 200:
{
  "success": true,
  "data": {
    "stayId": "uuid",
    "checkOutDate": "2024-06-15",
    "status": "COMPLETED",
    "stayDuration": 150
  }
}
```

### Get Tenant History
```http
GET /tenants/:id/history
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "tenant": {
      "id": "uuid",
      "name": "John Tenant",
      "email": "john.tenant@example.com"
    },
    "stays": [
      {
        "id": "uuid",
        "hostelName": "Downtown Hostel",
        "roomNumber": "201",
        "bedNumber": "201-A",
        "checkInDate": "2024-01-01",
        "checkOutDate": "2024-06-15",
        "duration": 165,
        "totalRent": 1650000,
        "status": "COMPLETED"
      }
    ]
  }
}
```

## Notice Management

### List Notices
```http
GET /notices?hostelId=uuid&priority=HIGH&page=1&limit=10
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "notices": [
      {
        "id": "uuid",
        "hostelId": "uuid",
        "hostelName": "Downtown Hostel",
        "title": "Maintenance Notice",
        "content": "Water supply will be interrupted on Sunday...",
        "priority": "HIGH",
        "createdBy": {
          "id": "uuid",
          "name": "John Admin"
        },
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Create Notice
```http
POST /notices
Authorization: Bearer jwt.access.token
Content-Type: application/json

{
  "hostelId": "uuid",
  "title": "New Rules",
  "content": "Please note the following new rules...",
  "priority": "MEDIUM"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "hostelId": "uuid",
    "title": "New Rules",
    "content": "Please note the following new rules...",
    "priority": "MEDIUM",
    "createdBy": "uuid",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

## Reports

### Occupancy Report
```http
GET /reports/occupancy?hostelId=uuid&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "summary": {
      "averageOccupancy": 85.5,
      "totalBeds": 100,
      "totalDaysOccupied": 2650,
      "totalPossibleDays": 3100
    },
    "daily": [
      {
        "date": "2024-01-01",
        "occupiedBeds": 85,
        "vacantBeds": 15,
        "occupancyRate": 85
      }
    ],
    "byRoomType": {
      "SINGLE": {
        "totalBeds": 20,
        "averageOccupancy": 90
      },
      "DOUBLE": {
        "totalBeds": 40,
        "averageOccupancy": 87.5
      },
      "TRIPLE": {
        "totalBeds": 30,
        "averageOccupancy": 83.3
      },
      "DORMITORY": {
        "totalBeds": 10,
        "averageOccupancy": 80
      }
    }
  }
}
```

### Revenue Report
```http
GET /reports/revenue?hostelId=uuid&year=2024&month=1
Authorization: Bearer jwt.access.token

Response 200:
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 850000,
      "totalExpected": 1000000,
      "collectionRate": 85,
      "averageRentPerBed": 10000
    },
    "byRoomType": {
      "SINGLE": {
        "revenue": 300000,
        "beds": 20
      },
      "DOUBLE": {
        "revenue": 350000,
        "beds": 40
      },
      "TRIPLE": {
        "revenue": 150000,
        "beds": 30
      },
      "DORMITORY": {
        "revenue": 50000,
        "beds": 10
      }
    },
    "trends": [
      {
        "month": "2024-01",
        "revenue": 850000,
        "occupancy": 85
      }
    ]
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Request validation failed
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

### Default Limits
- Authentication endpoints: 5 requests per minute
- Read endpoints: 100 requests per minute
- Write endpoints: 30 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

### Request Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (e.g., createdAt)
- `order` - Sort order (asc/desc)

### Response Format
```json
{
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Webhooks (Future Enhancement)

### Event Types
- `tenant.checked_in`
- `tenant.checked_out`
- `bed.status_changed`
- `payment.received`
- `notice.created`

### Webhook Payload
```json
{
  "id": "webhook_uuid",
  "event": "tenant.checked_in",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "tenantId": "uuid",
    "bedId": "uuid",
    "checkInDate": "2024-01-01"
  }
}
```

## API Versioning

### Version Strategy
- Version in URL path: `/api/v1/`, `/api/v2/`
- Deprecation notice via headers
- Minimum 6-month deprecation period

### Deprecation Headers
```
X-API-Deprecation-Date: 2024-12-31
X-API-Deprecation-Info: https://docs.api.com/deprecation