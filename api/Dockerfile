FROM node:lts-alpine3.17 AS api
# Prisma compat
RUN apk update \
  && apk add openssl1.1-compat

WORKDIR /api
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn run build

CMD ["yarn", "start:migrate:prod"]
