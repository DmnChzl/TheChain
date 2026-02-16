
# Stage 1: Production Dependencies
FROM oven/bun:alpine AS deps

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 1: Build with Bun
FROM oven/bun:alpine AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . ./
RUN bun build ./src/index.ts --outfile ./dist/index.js --target bun

# Stage 2: Run
FROM oven/bun:alpine AS runner

WORKDIR /app
RUN mkdir -p /app/data

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

COPY drizzle ./drizzle
COPY drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

CMD ["bun", "./dist/index.js"]
