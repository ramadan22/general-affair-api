# ===== BUILD STAGE =====
FROM node:20-alpine AS builder

# Prisma butuh openssl
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency dulu (biar cache efisien)
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build TypeScript → dist
RUN npm run build


# ===== RUNTIME STAGE =====
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy hasil build & dependency saja
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start"]
