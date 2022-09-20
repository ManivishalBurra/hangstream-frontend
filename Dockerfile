FROM node:14-alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN apk update
RUN apk add git
RUN npm i -a

COPY ./ ./

CMD ["npm","start"]