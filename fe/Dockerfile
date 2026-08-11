# syntax=docker/dockerfile:1

# ---- deps: Cài đặt dependencies ----
# Giai đoạn này chỉ cài đặt node_modules, tận dụng cache của Docker
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev: Target cho môi trường development (hot-reload) ----
# Được sử dụng bởi docker-compose.dev.yml
FROM deps AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- build: Biên dịch ứng dụng Next.js cho production ----
FROM deps AS build
WORKDIR /app
COPY . .

# !! ĐÂY LÀ BƯỚC QUAN TRỌNG NHẤT !!
# Khai báo các build arguments mà chúng ta mong đợi từ docker-compose.yml
ARG BE_API_URL
ARG NEXT_PUBLIC_MINIO_PUBLIC_URL

# Chạy lệnh build, Next.js sẽ có quyền truy cập vào các biến trên
RUN npm run build

# ---- production: Serve ứng dụng đã được build ----
FROM node:22-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]