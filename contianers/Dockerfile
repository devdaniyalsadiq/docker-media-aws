FROM node:18-alpine AS base 

RUN APK update
RUN APK upgrade
RUN apk add --no-caceh ffmpeg

WORKDIR /app

COPY package.json . 
COPY package-lock.json . 

RUN npm install

COPY index.js .

CMD ["npm","start"]