# =============================================================================
# Production Dockerfile for Vite/React Frontend
# =============================================================================
#
# Multi-stage build: builds the Vite app, then serves static files with nginx.
# Build: docker build -f Dockerfile -t easygenerator-frontend .
# Run:   docker run -p 80:80 easygenerator-frontend
#
# Note: VITE_* environment variables must be set at BUILD time, not runtime,
# since Vite inlines them during the build process.
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:24.16.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for API URL (must be set at build time for Vite)
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the Vite application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime (nginx)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx runs as non-root by default in newer versions
# Expose port 80
EXPOSE 80

# nginx will start automatically
CMD ["nginx", "-g", "daemon off;"]
