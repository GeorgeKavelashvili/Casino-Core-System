FROM node:14
WORKDIR /casino-app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
