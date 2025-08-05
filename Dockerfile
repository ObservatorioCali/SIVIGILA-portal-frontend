# ===========================================
# DOCKERFILE PARA SIVIGILA FRONTEND - PRODUCCIÓN
# ===========================================
# Optimizado para Cloud Run con Vite preview server

FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Build de la aplicación para producción
RUN npm run build

# Instalar vite globalmente para preview server optimizado
RUN npm install -g vite

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001 && \
    chown -R reactjs:nodejs /app

USER reactjs

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Exponer puerto
EXPOSE 8080

# Usar vite preview que es optimizado para archivos estáticos build
CMD ["vite", "preview", "--port", "8080", "--host", "0.0.0.0"]
