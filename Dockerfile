FROM alpine:3.5
MAINTAINER Marvin Menzerath <github@marvin-menzerath.de>

WORKDIR /app/putr/
COPY . /app/putr/
RUN apk -U --no-progress add nodejs && \
    cd /app/putr/ && \
    npm install && \
    addgroup -g 1789 putr && \
    adduser -h /app/putr/ -H -D -G putr -u 1789 putr && \
    chown -R putr:putr /app/putr/

USER putr
EXPOSE 8080
VOLUME /app/putr/config/
ENTRYPOINT ["/usr/bin/npm", "start"]