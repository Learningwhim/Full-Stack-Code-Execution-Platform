# Start from an official, lightweight Node.js image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your application code
COPY . .

# The command to run when the container starts
CMD ["node", "worker.js"]