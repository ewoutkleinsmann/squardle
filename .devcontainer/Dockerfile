# Use the official Node.js devcontainer base image
FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Install pnpm and update npm
RUN npm install -g pnpm@latest npm@latest

# Set working directory
WORKDIR /workspaces

# Expose the default Vite port
EXPOSE 5173
