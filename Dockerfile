FROM node:16

WORKDIR /app

# Copy dependency manifests first so Docker can cache this layer
# separately from the application code, faster rebuilds when only
# app.js changes.
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080
CMD ["node", "app.js"]
