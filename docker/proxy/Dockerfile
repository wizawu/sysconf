FROM node:14.16-buster-slim

RUN echo "deb http://mirrors.digitalocean.com/ubuntu focal main universe" > /etc/apt/sources.list
RUN apt update -o Acquire::AllowInsecureRepositories=true -y && \
    apt install --allow-unauthenticated --no-install-recommends -y \
    curl \
    libc6=2.31-0ubuntu9 \
    libx11-6 \
    libxext6 \
    wget \
    && \
    apt clean

RUN wget --no-check-certificate -q -O /usr/bin/brook \
    https://github.com/txthinking/brook/releases/download/v20200502/brook_linux_amd64

RUN wget --no-check-certificate -q -O - \
    https://github.com/xtaci/kcptun/releases/download/v20230214/kcptun-linux-amd64-20230214.tar.gz | \
    tar -C /usr/bin/ -zxf -

RUN mv /usr/bin/client_linux_amd64 /usr/bin/kcptun_client
RUN mv /usr/bin/server_linux_amd64 /usr/bin/kcptun_server
RUN chmod a+x /usr/bin/brook /usr/bin/kcptun_client /usr/bin/kcptun_server
RUN ln -f /usr/share/zoneinfo/PRC /etc/localtime
