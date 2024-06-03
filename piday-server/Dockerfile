FROM node:20 AS builder
WORKDIR /app
COPY ./package.json ./
RUN corepack enable
RUN yarn
COPY . .
ENV TZ Asia/Shanghai
ENV NODE_ENV production
RUN npx prisma generate
RUN yarn build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production
ENV TZ Asia/Shanghai
COPY --from=builder /app ./
CMD ["yarn", "start:prod"]
