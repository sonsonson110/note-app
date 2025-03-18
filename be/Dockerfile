# Development stage
FROM node:22.14-bookworm-slim AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./entrypoint-dev.sh

EXPOSE 8080

CMD ["sh", "./entrypoint-dev.sh"]