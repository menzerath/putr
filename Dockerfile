FROM node:8.1-alpine
MAINTAINER Marvin Menzerath <github@marvin-menzerath.de>

WORKDIR /app/putr/
COPY . /app/putr/
RUN cd /app/putr/ && \
    npm install && \
    addgroup -g 1789 putr && \
    adduser -h /app/putr/ -H -D -G putr -u 1789 putr && \
    chown -R putr:putr /app/putr/

USER putr
EXPOSE 8080
VOLUME /app/putr/config/
ENTRYPOINT ["/usr/local/bin/npm", "start"]