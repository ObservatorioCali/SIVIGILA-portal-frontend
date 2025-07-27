FROM node:20-alpine

WORKDIR /app

# Copia archivos de configuración
COPY package*.json ./

# Instala dependencias
RUN npm ci --only=production

# Audita y corrige vulnerabilidades
RUN npm audit fix --force || true

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto que usa Cloud Run
EXPOSE 8080

# Configura variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Ejecuta la aplicación en modo preview
CMD ["npm", "run", "preview"]