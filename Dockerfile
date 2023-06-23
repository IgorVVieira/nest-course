FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN cp .env.example .env

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
