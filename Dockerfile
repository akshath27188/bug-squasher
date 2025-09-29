# ----------------------------
# Stage 1: Build frontend
# ----------------------------
FROM node:20 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

RUN rm -rf dist && npm run build

# ----------------------------
# Stage 2: Runtime container
# ----------------------------
FROM node:20-slim AS runtime
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js .
COPY --from=builder /app/package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Expose port Cloud Run expects
ENV PORT=8081
EXPOSE 8081

# Start server
CMD ["node", "server.js"]
