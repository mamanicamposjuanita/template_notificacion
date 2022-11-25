FROM node
RUN mkdir -p /opt/src
WORKDIR /opt/src
COPY package*.json ./
RUN npm install -g nodemon
COPY . .
RUN npm install 

EXPOSE 8008

CMD ["npm" ,"run", "start"]