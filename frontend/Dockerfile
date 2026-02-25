# ---------- Builder ----------
FROM node:20-bullseye AS builder
WORKDIR /app

# Копируем package.json для установки зависимостей
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копируем локали в нужный путь, который Nuxt ищет
COPY i18n/locales ./locales

# Копируем остальной фронт
COPY . .

# Билдим Nuxt
RUN npm run build

# ---------- Production ----------
FROM node:20-bullseye
WORKDIR /app

# Копируем билд из builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json ./

# Устанавливаем только prod-зависимости
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
