#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi


npm install webpack

npm link webpack

npm install

npm run start:dev