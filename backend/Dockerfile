# =============================================================================
# Production Dockerfile for NestJS Backend
# =============================================================================
#
# Multi-stage build for minimal, secure production image.
# Build: docker build -f Dockerfile -t easygenerator-backend .
# Run:   docker run -p 3000:3000 --env-file .env easygenerator-backend
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:24.16.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (need devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime
# -----------------------------------------------------------------------------
FROM node:24.16.0-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER nestjs

# Port used by NestJS (Fastify)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Run the compiled application
CMD ["node", "dist/main"]
