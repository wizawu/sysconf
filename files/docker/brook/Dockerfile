FROM alpine:3.12.0

ENV GITHUB_REPO https://github.com/txthinking/brook
RUN wget -q $GITHUB_REPO/releases/download/v20200502/brook_linux_amd64 -O /usr/bin/brook
RUN chmod a+x /usr/bin/brook

ENTRYPOINT /usr/bin/brook
