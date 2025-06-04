# === Development stage ===
FROM node:20.9.0-bullseye-slim AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev auth"]

# === Build stage ===
FROM development AS build
RUN npm run build

# === Production stage ===
FROM node:20.9.0-bullseye-slim AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# В production только собранный JS-код и необходимые зависимости
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main.js"]