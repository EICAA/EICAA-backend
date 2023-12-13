FROM node:16-buster-slim as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY ./app /usr/src/app

RUN yarn install

FROM node:16-buster-slim

ENV NODE_ENV production
RUN mkdir /usr/src/app
RUN apt-get update
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
EXPOSE 3200
CMD ["yarn", "dev"]
