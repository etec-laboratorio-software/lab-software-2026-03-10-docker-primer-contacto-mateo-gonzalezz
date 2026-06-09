FROM node:20-slim

WORKDIR /app

# Copiar dependencias primero (mejor cache de Docker)
COPY package.json package-lock.json ./

RUN npm install

# Copiar todo el código del frontend
COPY . .

# Puerto Vite
EXPOSE 5173

# Dev server escuchando en todas las interfaces (necesario en Docker)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]