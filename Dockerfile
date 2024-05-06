FROM node:20-slim as node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm
WORKDIR /app

FROM node AS base
RUN apt-get update
RUN apt-get install -y python-is-python3 make g++
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY ./src ./src
RUN pnpm i

FROM base AS development
CMD ["pnpm", "dev"]

FROM base AS build
RUN pnpm build

FROM node as production
COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data
COPY package.json .
RUN pnpm i -P
CMD ["node", "dist/"]
