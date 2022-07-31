FROM node

COPY . .

RUN npm install

EXPOSE 4444

CMD ["node", "index.js"]