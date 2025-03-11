FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

ENV NODE_ENV=production

RUN yarn install --production

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/.medusa/server /app
COPY --from=build /app/node_modules /app/node_modules

EXPOSE 9000

CMD ["sh", "-c", "yarn predeploy && yarn seed && yarn start"]