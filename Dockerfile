# Base stage
FROM node:16.15.1-alpine3.15 as base

RUN mkdir /var/log/coffee-time
RUN chown node:node /var/log/coffee-time
WORKDIR /node
RUN chown node:node /node
USER node

# Development stage
FROM base AS development

ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV LOG_LEVEL=debug
ENV PATH /node/node_modules/.bin:$PATH
EXPOSE $PORT 9229

COPY --chown=node:node package*.json ./

RUN \
  NODE_ENV=development && \
  npm ci && \
  npm cache clean --force

WORKDIR /node/app

CMD [ "nodemon" ]

# Source stage
FROM base AS source

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV LOG_LEVEL=info

WORKDIR /node
COPY --chown=node:node package*.json ./

RUN npm ci && npm cache clean --force

WORKDIR /node/app
RUN chown node:node /node/app
COPY --chown=node:node . .

# Test stage
FROM source AS test

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV LOG_LEVEL=debug
ENV PATH /node/node_modules/.bin:$PATH

COPY --chown=node:node --from=development /node/node_modules /node/node_modules

RUN npm run test && npm run lint

# Production stage
FROM source AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV LOG_LEVEL=info
ENV PATH /node/node_modules/.bin:$PATH
ENV PORT=3000

EXPOSE $PORT

CMD [ "node", "bin/www" ]
