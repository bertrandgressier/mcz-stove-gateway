ARG BUILD_FROM
FROM $BUILD_FROM

# Copy root filesystem
COPY rootfs /

# Create app directory
WORKDIR /usr/src/app

COPY ../app/package*.json ./
RUN npm ci --only=production
COPY ../app .
RUN npm run build
