FROM node:18-alpine as build-image

LABEL maintainer Daniel Taiwo <danielmayowataiwo@gmail.com>

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

CMD [ "yarn", "start:dev" ]
