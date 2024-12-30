# Base image
FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY ../app/package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY ../app .

# Creates a "dist" folder with the production build
RUN npm run build

ARG BUILD_FROM
FROM $BUILD_FROM

# Copy root filesystem
COPY rootfs /

# Create app directory
WORKDIR /usr/src/app

COPY ../app/package*.json ./
RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist
