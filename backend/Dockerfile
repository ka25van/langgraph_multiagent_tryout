###################Stage 1-Build
FROM node:18 AS builder

WORKDIR /app

# Copy only packages files first(better cache)
COPY package*.json ./

# Install all dependencies(with dev)
RUN npm install

# Copy reset of the src code
COPY . .

###################Stage 2- Production
FROM node:18-slim

WORKDIR /app

# Copy only necessary files from buider stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

#Expose the port
EXPOSE 3000


#Start the app
CMD ["node", "src/index.js"]

