# Используем Node.js LTS
FROM node:20

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем весь код
COPY . .

# Собираем TypeScript один раз
RUN npm run build

# Экспортируем порт, если нужно
EXPOSE 3000

# Запуск готового JS (без пересборки)
CMD ["node", "dist/bin/www.js"]


