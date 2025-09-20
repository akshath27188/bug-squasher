# Step 1: Use an official Node.js runtime as a parent image.
# We use a specific version for consistency and alpine for a smaller image size.
FROM node:18-alpine

# Step 2: Set the working directory inside the container.
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available).
# This leverages Docker's layer caching. Dependencies are only re-installed if package.json changes.
COPY package*.json ./

# Step 4: Install all dependencies, including devDependencies needed for the build.
RUN npm install

# Step 5: Copy the rest of your application's source code into the container.
COPY . .

# Step 6: IMPORTANT - Build the TypeScript code into JavaScript.
# This runs the "build" script from your package.json ("tsc --project tsconfig.json").
RUN npm run build

# Step 7: Prune development dependencies to create a smaller production image.
RUN npm prune --production

# Step 8: Expose the port the app runs on. Cloud Run will use this.
EXPOSE 8080

# Step 9: Define the command to run the application.
# This executes the "start" script from your package.json ("node server.js").
CMD [ "npm", "start" ]
