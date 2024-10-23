FROM node:18-alpine as build-image

LABEL maintainer Daniel Taiwo <danielmayowataiwo@gmail.com>

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start:dev" ]
