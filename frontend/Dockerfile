# frontend/Dockerfile

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server; --host 0.0.0.0 makes it accessible from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
