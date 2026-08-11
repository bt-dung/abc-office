# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
# bcrypt compiles a native addon at install time if no prebuilt binary matches this platform
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev: hot-reload target used by docker-compose.dev.yml ----
FROM deps AS dev
EXPOSE 5000
CMD ["npm", "run", "start:dev"]

# ---- build: compile TypeScript + generate Prisma client ----
FROM deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- production: full node_modules kept (prisma CLI needed for migrate/seed at boot) ----
FROM node:22-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/main"]
