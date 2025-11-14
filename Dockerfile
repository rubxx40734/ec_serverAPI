# --- Stage 1: Build stage ---
# 我們使用 Node 20
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

# 這是第一次 install，我們加上 --legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# --- Stage 2: Production stage ---
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# 這是第二次 install，它也必須加上 --legacy-peer-deps
# 並且 npm 建議用 --omit=dev 取代 --only=production
# 我們把它改成最標準的寫法：
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]