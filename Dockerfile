# Base stage
FROM node:16.15.1-alpine3.15 as base

RUN mkdir /var/log/coffee-time
RUN chown node:node /var/log/coffee-time
WORKDIR /node
RUN chown node:node /node
USER node
ENV PATH /node/node_modules/.bin:$PATH
COPY --chown=node:node package*.json ./

# Development stage
FROM base AS development

RUN npm install
WORKDIR /node/app

CMD nodemon bin/www | bunyan

# Source stage
FROM base AS production

RUN npm ci && npm cache clean --force

WORKDIR /node/app
RUN chown node:node /node/app
COPY --chown=node:node . .

CMD [ "node", "bin/www" ]
