# Base image
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
#COPY .env .env
RUN npx --yes prisma@6.2.1 generate && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN apk add --no-cache libc6-compat && \
    npm install -g tsx bcryptjs && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy essential files from builder
COPY --from=builder /app/public ./public

# Create uploads directory with correct permissions
RUN mkdir -p public/uploads
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY entrypoint.sh ./

# Ensure entrypoint is executable
USER root
RUN chmod +x entrypoint.sh && \
    mkdir -p node_modules/.prisma node_modules/@prisma && \
    chown -R nextjs:nodejs node_modules/.prisma node_modules/@prisma

EXPOSE 3003

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["sh", "entrypoint.sh"]
