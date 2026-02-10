FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Production stage — serve with Node
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm install --prod --frozen-lockfile 2>/dev/null || true

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
