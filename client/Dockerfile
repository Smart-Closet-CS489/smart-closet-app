# Stage 1: Build the React app
FROM node:16-alpine AS client-build
WORKDIR /app/client

# Copy React app files and install dependencies
COPY client/package*.json ./
RUN npm install
COPY client/ .
# Build the production version of the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000
