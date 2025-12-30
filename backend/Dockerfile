# backend/Dockerfile

FROM node:20-alpine

# Create app directory in the container
WORKDIR /usr/src/app

# Install dependencies (use package.json + package-lock.json)
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source
COPY . .

# Expose backend port
EXPOSE 5000

# Default command (dev mode with nodemon)
CMD ["npm", "run", "dev"]
