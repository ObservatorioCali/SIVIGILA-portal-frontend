FROM node:18-alpine

WORKDIR /app

# Copia archivos de configuración
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Instala dependencias
RUN npm ci

# Copia código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Expone puerto para GCP
EXPOSE 8080

# Comando para ejecutar en producción
CMD ["npm", "run", "preview"]