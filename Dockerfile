# Stage 1: install deps and build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# NEXT_PUBLIC_* variables are baked into the JS bundle at BUILD time,
# not read at container start time — so they must be passed as build
# args here, not just as `environment:` in docker-compose.
ARG NEXT_PUBLIC_CATALOG_API
ARG NEXT_PUBLIC_ORDER_API
ENV NEXT_PUBLIC_CATALOG_API=$NEXT_PUBLIC_CATALOG_API
ENV NEXT_PUBLIC_ORDER_API=$NEXT_PUBLIC_ORDER_API

RUN npm run build

# Stage 2: minimal runtime image using Next.js standalone output
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
