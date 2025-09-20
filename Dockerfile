# Step 1: Use an official Node.js runtime as a parent image
# Use a specific version for reproducibility, e.g., Node 18
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
# Copy package.json first to leverage Docker layer caching
COPY package.json ./
RUN npm install

# Step 4: Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Step 5: Your app binds to port 8080, so you need to expose this port
EXPOSE 8080

# Step 6: Define the command to run your app
# This will run "node server.js"
CMD [ "npm", "start" ]
