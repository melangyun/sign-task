FROM node:10

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \  
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Bundle app source
COPY . .

RUN chmod +x docker-entrypoint.sh  
ENTRYPOINT ./docker-entrypoint.sh

# Expose port and start application
EXPOSE 3000
