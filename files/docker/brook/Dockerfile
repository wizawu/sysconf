FROM node:12.20-buster-slim

RUN echo "deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu focal main universe" > /etc/apt/sources.list
RUN apt update -o Acquire::AllowInsecureRepositories=true -y && \
    apt install --allow-unauthenticated --no-install-recommends -y \
        libc6=2.31-0ubuntu9 \
        curl \
        dante-server \
        nodejs \
        && \
    apt clean

RUN curl -sk https://github.com/txthinking/brook/releases/download/v20200502/brook_linux_amd64 -o /usr/bin/brook
RUN chmod a+x /usr/bin/brook

ENTRYPOINT ["/usr/bin/brook"]
