# Stage 1: Build the React app
FROM node:16-alpine AS client-build
WORKDIR /app/client

# Copy React app files and install dependencies
COPY client/package*.json ./
RUN npm install
COPY client/ .
# Build the production version of the React app
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:16-alpine AS server-build
WORKDIR /app/serverclear


# Copy server files and install dependencies
COPY server/package*.json ./
RUN npm install
COPY server/ .

# Copy the React build from the client stage to the server's build folder
COPY --from=client-build /app/client/build ./build

# Expose the port the app runs on
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
