FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
COPY --from=builder /app/dist /dist
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:$PORT"]