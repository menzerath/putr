FROM node:8.1-alpine
MAINTAINER Marvin Menzerath <github@marvin-menzerath.de>

RUN apk -U add curl

WORKDIR /app/putr/
COPY . /app/putr/
RUN cd /app/putr/ && \
    npm install

EXPOSE 8080
VOLUME /app/putr/config/
HEALTHCHECK --timeout=5s CMD curl --fail http://localhost:8080 || exit 1
ENTRYPOINT ["/usr/local/bin/npm", "start"]