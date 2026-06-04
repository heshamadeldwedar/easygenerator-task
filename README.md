# Auth Module

A full-stack sign-up / sign-in authentication module with React frontend and NestJS backend.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Scripts](#scripts)

## Tech Stack

<p>
  <img src="assets/vite.svg" alt="Vite" width="40" height="40" />
  <img src="assets/react.svg" alt="React" width="40" height="40" />
  <img src="assets/typescript.svg" alt="TypeScript" width="40" height="40" />
  <img src="assets/nestjs.svg" alt="NestJS" width="40" height="40" />
  <img src="assets/mongodb.svg" alt="MongoDB" width="40" height="40" />
  <img src="assets/docker.svg" alt="Docker" width="40" height="40" />
</p>

- **Frontend**: Vite + React + TypeScript
- **Backend**: NestJS + MongoDB
- **Infrastructure**: Docker Compose

## Quick Start

```bash
# Clone and run
git clone <repo-url>
cd easygenerator
docker-compose up
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3000`.

<details>
<summary><strong>Prerequisites</strong></summary>

- Docker & Docker Compose
- Node.js 18+ (for local dev)
- npm or yarn

</details>

<details>
<summary><strong>Environment Variables</strong></summary>

Create `.env` files based on `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/auth` |
| `JWT_SECRET` | Secret for JWT signing | - |
| `PORT` | Backend port | `3000` |

</details>

<details>
<summary><strong>API Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register new user |
| `POST` | `/auth/signin` | Login user |
| `GET` | `/protected` | Protected route (requires JWT) |

</details>

<details>
<summary><strong>Project Structure</strong></summary>

```
easygenerator/
├── frontend/          # Vite + React + TypeScript
├── backend/           # NestJS + MongoDB
├── assets/            # Logos and images
├── docker-compose.yml
└── README.md
```

</details>

<details>
<summary><strong>Testing</strong></summary>

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

</details>

<details>
<summary><strong>Scripts</strong></summary>

```bash
# Development
docker-compose up           # Run all services
docker-compose up --build   # Rebuild and run

# Individual services
cd frontend && npm run dev  # Frontend only
cd backend && npm run start:dev  # Backend only
```

</details>
