FROM node
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN npm install bcryptjs jsonwebtoken mongoose ws -y
RUN npm install nodemon -g
RUN npm install --force
COPY . .
EXPOSE 8008

CMD ["nodemon", "run dev"]
