FROM node:12-alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build
ENTRYPOINT [ "node", "/app/build/index.js" ]