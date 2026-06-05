# Auth Module

A full-stack sign-up / sign-in authentication module with React frontend and NestJS backend.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Docker Architecture](#docker-architecture)
- [Production Builds](#production-builds)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Changelog](#changelog)
- [AI Assistance](#ai-assistance)

## Tech Stack

<p>
  <img src="assets/vite.svg" alt="Vite" width="40" height="40" />
  <img src="assets/react.svg" alt="React" width="40" height="40" />
  <img src="assets/typescript.svg" alt="TypeScript" width="40" height="40" />
  <img src="assets/nestjs.svg" alt="NestJS" width="40" height="40" />
  <img src="assets/mongodb.svg" alt="MongoDB" width="40" height="40" />
  <img src="assets/docker.svg" alt="Docker" width="40" height="40" />
</p>

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: NestJS + Fastify + MongoDB
- **Infrastructure**: Docker Compose

## Quick Start

```bash
# Clone and run (no host npm install needed!)
git clone <repo-url>
cd easygenerator
docker compose up --build
```

That's it! All dependencies install inside Docker containers.

| Service  | URL                                   |
|----------|---------------------------------------|
| Frontend | http://localhost:5173                 |
| Backend  | http://localhost:3000                 |
| Swagger  | http://localhost:3000/api/docs        |
| MongoDB  | localhost:27017                       |

<details>
<summary><strong>Prerequisites</strong></summary>

- Docker & Docker Compose (v2+)
- Node.js 24+ (only for local development without Docker)

</details>

## Docker Architecture

### Development (docker-compose.yml)

The dev setup uses bind mounts for live editing with hot reload:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Network (coursely)                     │
├───────────────┬───────────────────────┬─────────────────────────┤
│    mongo      │       backend         │       frontend          │
│   :27017      │       :3000           │       :5173             │
│               │                       │                         │
│ MongoDB data  │ NestJS + hot reload   │ Vite + HMR              │
│ (volume)      │ (bind mount + anon    │ (bind mount + anon      │
│               │  vol for node_modules)│  vol for node_modules)  │
└───────────────┴───────────────────────┴─────────────────────────┘
```

**Key design decisions:**

- **node_modules in container**: Native modules (bcrypt, esbuild) are built for the container's Linux, avoiding host/container architecture mismatches. An anonymous volume shadows the host's node_modules.
- **Service names vs host ports**: Service-to-service calls use Docker service names (`mongo:27017`). Browser-origin calls use host-published ports (`localhost:3000`) since the browser is outside Docker.
- **Zero host install**: You don't need `npm install` on your host machine. Just run `docker compose up --build`.

### Useful Commands

```bash
# Start development
docker compose up --build

# Rebuild a single service
docker compose build backend

# View logs
docker compose logs -f backend

# Stop everything
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

## Production Builds

Production images are multi-stage, optimized, and run as non-root users. Build and run them directly (no compose file for production):

```bash
# Backend
docker build -f backend/Dockerfile -t coursely-backend ./backend
docker run -p 3000:3000 --env-file backend/.env coursely-backend

# Frontend (VITE_* vars are baked in at build time)
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t coursely-frontend ./frontend
docker run -p 80:80 coursely-frontend
```

<details>
<summary><strong>Environment Variables</strong></summary>

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/coursely` |
| `JWT_ACCESS_SECRET` | Secret for JWT signing (min 32 chars) | - |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token TTL | `7d` |
| `COOKIE_SECRET` | Cookie signing secret (min 32 chars) | - |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL (browser-side) | `http://localhost:3000` |

> **Note**: For Docker Compose, these are set in `docker-compose.yml`. For local dev, copy `.env.example` to `.env`.

</details>

<details>
<summary><strong>API Endpoints</strong></summary>

Auth endpoints are prefixed with `/api/v1`. Health stays at root for infra probes.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/signup` | Public | Register new user |
| `POST` | `/api/v1/auth/signin` | Public | Login user |
| `POST` | `/api/v1/auth/refresh` | Cookie | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Public | Clear refresh cookie |
| `GET` | `/api/v1/auth/me` | JWT | Get current user |
| `GET` | `/health` | Public | Health check (root, no prefix) |

See full API docs at http://localhost:3000/api/docs (Swagger).

</details>

<details>
<summary><strong>Project Structure</strong></summary>

```
easygenerator/
├── frontend/              # Vite + React + TypeScript
│   ├── Dockerfile         # Production (multi-stage, nginx)
│   ├── Dockerfile.dev     # Development (hot reload)
│   └── nginx.conf         # SPA routing config
├── backend/               # NestJS + Fastify + MongoDB
│   ├── Dockerfile         # Production (multi-stage, non-root)
│   └── Dockerfile.dev     # Development (watch mode)
├── assets/                # Logos and images
├── docker-compose.yml     # Development environment
└── README.md
```

</details>

<details>
<summary><strong>Testing</strong></summary>

```bash
# Backend tests (requires local npm install or exec into container)
docker compose exec backend npm test

# Or locally
cd backend && npm test
```

</details>

## Changelog

Changelogs are automatically generated from [Conventional Commits](https://www.conventionalcommits.org/) using GitHub Actions.

| Package | Changelog |
|---------|-----------|
| Backend | [backend/CHANGELOG.md](backend/CHANGELOG.md) |
| Frontend | [frontend/CHANGELOG.md](frontend/CHANGELOG.md) |

**How it works:**
- On every push to `main`, the changelog workflow runs
- Parses commit messages (`feat:`, `fix:`, etc.) and updates CHANGELOG.md
- Commits the updated changelogs back to the repository

**Generate locally:**
```bash
cd backend && npm run changelog
cd frontend && npm run changelog
```

## AI Assistance

This project was developed with AI assistance. See [AI.md](AI.md) for a detailed log of the development journey, including prompts, decisions, and outcomes for each phase.
