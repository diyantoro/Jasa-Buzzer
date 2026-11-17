# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Deps
# ---------------------------------------------------------------------------
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------------------------------------------------------------------------
# Build
#
# Lovable's Vite config defaults Nitro to the `cloudflare-module` preset. That
# output is a Worker entry, not a Node server, so the Docker runtime would
# crash on startup. Force the Node server preset for container builds.
# ---------------------------------------------------------------------------
FROM oven/bun:1.2-alpine AS build
WORKDIR /app

ENV NITRO_PRESET=node-server

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Only public Supabase settings are embedded into the browser bundle.
ARG VITE_SUPABASE_PROJECT_ID
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

RUN bun run build

# ---------------------------------------------------------------------------
# Runtime
#
# Use the official Node image because `NITRO_PRESET=node-server` emits a
# standard Node HTTP server at `.output/server/index.mjs`.
# Secrets are injected at runtime via docker-compose, never baked into layers.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

COPY --from=build --chown=node:node /app/.output ./.output

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
