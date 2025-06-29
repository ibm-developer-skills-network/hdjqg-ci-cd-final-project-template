FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S service -u 1001 -G nodejs && \
    chown -R service:nodejs /app

USER service

# Expose port
ENV PORT=8000
EXPOSE $PORT

# Start application
CMD ["npm", "start"]