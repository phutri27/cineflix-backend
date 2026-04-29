FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DATABASE_URL="postgresql://phu50:socdota1@db:5432/cinema"
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]