FROM node:18-alpine

RUN apk add --no-cache bash

RUN npm link webpack

RUN npm install -g @nestjs/cli@9.0.0

USER node

WORKDIR /home/node/app