FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm i -g serverless@3
RUN npm i -g prisma
RUN npm i

# Copy the entire project directory
COPY . .

# If you want to specifically override the .env file
COPY .env-local-docker ./.env
RUN rm /app/.env-local-docker

RUN mkdir -p /tmp/local-bucket

EXPOSE 3000