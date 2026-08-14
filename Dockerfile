FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn global add tsc-alias && yarn install --frozen-lockfile --production=false

COPY . .

RUN npx prisma generate && yarn build

EXPOSE 3000

CMD ["node", "dist/index.js"]