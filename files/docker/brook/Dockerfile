FROM alpine:3.12.0

RUN wget -q https://github.com/txthinking/brook/releases/download/v20200502/brook_linux_amd64 -O /usr/bin/brook
RUN chmod a+x /usr/bin/brook
RUN apk add dante-server

ENTRYPOINT ["/usr/bin/brook"]
