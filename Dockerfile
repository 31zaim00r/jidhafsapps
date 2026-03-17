# Build Environment
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production Environment
FROM nginx:alpine

# Copy the built assets to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Coolify will detect this automatically)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
