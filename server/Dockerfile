FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY summaryTemplate.xlsx ./

COPY ./dist ./dist

CMD ["npm", "run", "start"]