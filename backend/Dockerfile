# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies (python3, make, g++)
RUN apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Enable corepack for Yarn PnP
RUN corepack enable

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Copy .env file
COPY backend/.env .env

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]