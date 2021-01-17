FROM docker:dind as builder
RUN apk add --update nodejs npm
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build
ENTRYPOINT [ "node", "/app/build/index.js" ]