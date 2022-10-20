FROM node:lts-alpine AS api

# Doppler for env handling
RUN apk add --no-cache bind-tools gnupg git tini
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

WORKDIR /api
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
COPY . .
RUN yarn prisma generate
RUN yarn run build
EXPOSE 3000

ENTRYPOINT ["tini", "--"]

CMD ["doppler", "run", "--", "yarn", "start:migrate:prod"]
