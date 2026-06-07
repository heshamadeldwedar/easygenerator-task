# Auth Module

A full-stack authentication system with sign-up and sign-in flows. The frontend is a React SPA that talks to a NestJS API, which persists data in MongoDB. Everything runs in Docker so you don't need to install anything on your machine.

## Quick Start

```bash
git clone https://github.com/heshamadeldwedar/easygenerator-task
cd easygenerator-task

cp ./backend/.env.example ./backend/.env
cp ./frontend/.env.example ./frontend/.env

docker compose up --build
```

The env files come with sensible defaults for local development. Edit them if you need to change secrets or ports.

| Service  | URL                            |
|----------|--------------------------------|
| Frontend | http://localhost:5173          |
| Backend  | http://localhost:3000          |
| Swagger  | http://localhost:3000/api/docs |
| MongoDB  | localhost:27017                |

## API Endpoints

All auth endpoints are prefixed with `/api/v1`. The health check stays at root for infrastructure probes.

| Method | Endpoint              | Auth   | Description                        |
|--------|-----------------------|--------|------------------------------------|
| POST   | /api/v1/auth/signup   | Public | Register a new user                |
| POST   | /api/v1/auth/signin   | Public | Log in and receive tokens          |
| POST   | /api/v1/auth/refresh  | Cookie | Exchange refresh token for new access token |
| POST   | /api/v1/auth/logout   | Public | Clear the refresh cookie and revoke the token |
| GET    | /api/v1/auth/me       | JWT    | Get the current user's profile     |
| GET    | /health               | Public | Health check                       |

## Database

MongoDB stores two collections.

**users**

| Field       | Type     | Notes                                      |
|-------------|----------|--------------------------------------------|
| _id         | ObjectId | Primary key                                |
| email       | string   | Unique, lowercase, indexed                 |
| name        | string   | Min 3 characters                           |
| password    | string   | Bcrypt hash, excluded from queries by default |
| permissions | string[] | PBAC permission strings (e.g. `user:read:self`) |
| createdAt   | Date     | Auto-generated                             |
| updatedAt   | Date     | Auto-generated                             |

**refreshtokens**

| Field     | Type     | Notes                                        |
|-----------|----------|----------------------------------------------|
| _id       | ObjectId | Primary key                                  |
| userId    | ObjectId | References users._id, indexed                |
| tokenHash | string   | SHA-256 hash of the token, indexed           |
| expiresAt | Date     | TTL index auto-deletes expired tokens        |
| revoked   | boolean  | Set to true on logout                        |
| createdAt | Date     | Auto-generated                               |
| updatedAt | Date     | Auto-generated                               |

## Environment Variables

**Backend**

| Variable             | Description                          | Default                              |
|----------------------|--------------------------------------|--------------------------------------|
| PORT                 | Server port                          | 3000                                 |
| MONGO_URI            | MongoDB connection string            | mongodb://localhost:27017/coursely   |
| JWT_ACCESS_SECRET    | Secret for signing JWTs (min 32 chars) | —                                  |
| JWT_ACCESS_EXPIRY    | Access token TTL                     | 15m                                  |
| REFRESH_TOKEN_EXPIRY | Refresh token TTL                    | 7d                                   |
| COOKIE_SECRET        | Secret for signing cookies (min 32 chars) | —                               |
| CORS_ORIGIN          | Allowed CORS origin                  | http://localhost:5173                |
| BCRYPT_ROUNDS        | Password hashing cost factor         | 12                                   |

**Frontend**

| Variable          | Description              | Default               |
|-------------------|--------------------------|-----------------------|
| VITE_API_BASE_URL | Backend URL for the browser | http://localhost:3000 |

For Docker Compose these are already set in `docker-compose.yml`. For local development copy `.env.example` to `.env`.

## How Authentication Works

The system uses short-lived access tokens and long-lived refresh tokens. Access tokens expire in 15 minutes and are sent in the `Authorization` header. Refresh tokens last 7 days and are stored in an HTTP-only cookie.

**Why cookies for refresh tokens?**

Storing the refresh token in a cookie with `httpOnly: true` means JavaScript cannot read it. This protects against XSS attacks where malicious scripts steal tokens from localStorage or memory. The cookie is also set with `sameSite: lax` and `secure: true` in production to prevent CSRF and ensure it only travels over HTTPS.

**Token rotation**

When the frontend calls `/api/v1/auth/refresh`, the backend does three things: verifies the old token, revokes it, and issues a new pair. This rotation limits the damage if a refresh token is somehow leaked because each token can only be used once.

**Automatic cleanup**

MongoDB's TTL index on `expiresAt` automatically deletes expired tokens. No cron job needed.

## Permissions

The API uses Permission-Based Access Control (PBAC) instead of traditional roles. Permissions follow a `resource:action:scope` format like `user:read:self`. Each user has an array of permissions stored directly on their document.

Why this approach? Roles are convenient but inflexible. A "moderator" role might bundle 20 permissions, but what if you need someone who can moderate but not ban? You end up creating more roles. With PBAC, you assign exactly the permissions each user needs. The code also becomes more explicit: `@RequirePermissions('user:read:self')` tells you exactly what access is needed.

Currently only `user:read:self` exists because that's all this auth module needs. The pattern is ready for expansion. When the app grows, you add permissions like `course:create`, `course:delete:own`, or `admin:users:read` without changing any authorization logic.

## Response Format

Every response from the API includes a `requestId` that you can use to trace requests through logs. Success and error responses follow a consistent structure.

**Success response**

```json
{
  "success": true,
  "data": { ... },
  "requestId": "01J5X7..."
}
```

**Error response**

```json
{
  "success": false,
  "error": {
    "type": "validation-error",
    "title": "Validation Error",
    "status": 422,
    "detail": "Validation failed",
    "errors": [
      { "field": "email", "message": "email must be an email" }
    ]
  },
  "requestId": "01J5X7..."
}
```

The `requestId` is a ULID generated by the server. It also appears in the `X-Request-Id` response header and in every log line. In production, when a user reports an issue, you can grep for their request ID and see exactly what happened:

```
[01J5X7...] POST /api/v1/auth/signin 401 12ms
```

## Changelog

Changelogs are generated from conventional commits on every push to main.

| Package  | Changelog                            |
|----------|--------------------------------------|
| Backend  | [backend/CHANGELOG.md](backend/CHANGELOG.md)   |
| Frontend | [frontend/CHANGELOG.md](frontend/CHANGELOG.md) |

## AI Assistance

This project was developed with AI assistance. See [AI.md](AI.md) for the development log.
