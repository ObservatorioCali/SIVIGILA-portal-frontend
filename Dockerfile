# Dockerfile para frontend Vite en Cloud Run
FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Instala vite globalmente para usar `vite preview`
RUN npm install -g vite

# Usa el puerto que Cloud Run define
ENV PORT=8080

EXPOSE 8080

CMD ["vite", "preview", "--port", "8080", "--host"]
