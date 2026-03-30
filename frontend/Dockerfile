FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Build de producción
RUN npm run build

# Servir con Vite preview
EXPOSE 5173

CMD ["npm", "run", "preview"]