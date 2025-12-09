# ==========================================
# MULTI-STAGE DOCKERFILE FOR PANEL (FRONTEND)
# Production-optimized with security best practices
# ==========================================

# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
COPY apps/panel/package.json ./apps/panel/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/schemas/package.json ./packages/schemas/

# Install dependencies
RUN npm ci --ignore-scripts

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/panel/node_modules ./apps/panel/node_modules

# Copy source code
COPY . .

# Build arguments for environment
ARG VITE_API_BASE_URL
ARG VITE_SENTRY_DSN
ARG VITE_GA_MEASUREMENT_ID

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}
ENV VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
ENV NODE_ENV=production

# Build application
WORKDIR /app/apps/panel
RUN npm run build

# ==========================================
# STAGE 3: Production (nginx)
# ==========================================
FROM nginx:alpine AS runner

# Security: Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Custom nginx configuration for SPA
COPY --from=builder /app/apps/panel/dist /usr/share/nginx/html

# Create nginx config for SPA routing
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss image/svg+xml;
    gzip_comp_level 6;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # SPA fallback - all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Security: Run as non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

# Metadata
LABEL org.opencontainers.image.title="AsistanApp Panel"
LABEL org.opencontainers.image.description="Multi-tenant AI assistant admin panel"
LABEL org.opencontainers.image.vendor="AsistanApp Team"
LABEL org.opencontainers.image.licenses="MIT"

