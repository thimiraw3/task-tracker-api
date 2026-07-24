# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first — this layer only gets rebuilt when
# dependencies change, not on every code change, so builds are much faster
COPY package*.json ./

# npm ci (not npm install) installs exactly what's in package-lock.json —
# reproducible, and faster in CI
RUN npm ci --omit=dev

COPY src ./src

# ---- Runtime stage ----
FROM node:20-alpine AS runtime

WORKDIR /app

# The official node:alpine image already has a non-root 'node' user built in —
# running as root inside a container is a common security misconfiguration,
# since a container breakout would then give root on the host
USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]