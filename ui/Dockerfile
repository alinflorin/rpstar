FROM node:12-alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run ng build -- --prod

FROM abiosoft/caddy
COPY --from=builder /app/dist/rpstar-ui /srv