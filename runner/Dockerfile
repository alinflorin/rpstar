FROM node:12-alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build
COPY ./docker_scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod 544 /app/entrypoint.sh
ENV RUNNER_INPUT="{}"
CMD /app/entrypoint.sh