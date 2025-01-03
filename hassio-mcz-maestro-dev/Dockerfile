ARG BUILD_FROM
FROM $BUILD_FROM as base

WORKDIR /app
ENV NODE_ENV production

RUN apk add yq

COPY rootfs /
COPY app/dist ./dist
COPY app/package* ./
RUN cd /app && npm ci --only=production


