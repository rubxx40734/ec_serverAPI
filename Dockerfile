# --- Stage 1: Build stage ---
# 使用一個包含 Node.js 的官方映像檔作為基底
FROM node:18-alpine AS development

# 在容器內建立一個工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製整個專案的程式碼到容器內
COPY . .

# 執行 NestJS 的 build 指令
RUN npm run build

# --- Stage 2: Production stage ---
# 使用一個更小的 Node.js 映像檔來減少最終大小
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# 只安裝生產環境需要的依賴
RUN npm install --only=production

# 從 development stage 複製編譯好的程式碼
COPY --from=development /usr/src/app/dist ./dist

# 這個容器對外開放 3000 port
EXPOSE 3000

# 容器啟動時要執行的指令
CMD ["node", "dist/main"]