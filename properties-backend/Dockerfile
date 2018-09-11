# ---- Base Node ----
FROM node:8.11-alpine AS base

RUN apk update && \
    apk upgrade && \
    apk add bash && \
    apk add --no-cache tini

WORKDIR /home/node/app

COPY package.json package.json
COPY package-lock.json package-lock.json


# ---- Dependencies ----
FROM base AS dependencies

RUN npm install --production=true \
    && cp -R node_modules prod_node_modules \
    && npm install --production=false

# ---- Test ----
FROM base AS test
COPY . .
COPY --from=dependencies /home/node/app/node_modules ./node_modules
RUN npm run lint && npm test

# ---- Release ----
FROM base AS release

USER node

ENV PORT 8000
EXPOSE 8000

COPY --chown=node:node --from=dependencies /home/node/app/prod_node_modules ./node_modules
COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/node" ]
CMD ["bin/www"]
