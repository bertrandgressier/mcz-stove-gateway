ARG BUILD_FROM
FROM $BUILD_FROM as base

ENV LANG C.UTF-8
ARG BUILD_VERSION

FROM base as build

RUN apk add git

RUN echo "Installing Dev version"
RUN node --version
RUN npm version
RUN git clone -b main --single-branch --depth 1 https://github.com/bertrandgressier/mcz-stove-gateway /build
RUN mkdir /build/app/dist
RUN jq -n --arg commit $(eval cd /build;git rev-parse --short HEAD) '$commit' > /build/app/dist/.hash ;
RUN cd /build/app && npm install && npm run build

# Release
FROM base as release

WORKDIR /app
ENV NODE_ENV production

RUN apk add yq

COPY rootfs /
COPY --from=build /build/app/dist ./dist
COPY --from=build /build/app/package* ./
RUN cd /app && npm ci --only=production


