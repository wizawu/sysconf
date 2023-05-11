FROM node:14.16-buster-slim

RUN echo "deb http://hk.archive.ubuntu.com/ubuntu focal main universe" > /etc/apt/sources.list
RUN apt update -o Acquire::AllowInsecureRepositories=true -y && \
    apt install --allow-unauthenticated --no-install-recommends -y \
    curl \
    libc6=2.31-0ubuntu9 \
    libx11-6 \
    libxext6 \
    wget \
    && \
    apt clean

RUN wget --no-check-certificate -q -O - \
    https://github.com/ekzhang/bore/releases/download/v0.5.0/bore-v0.5.0-x86_64-unknown-linux-musl.tar.gz | \
    tar -C /usr/bin/ -zxf -

RUN wget --no-check-certificate -q -O /usr/bin/brook \
    https://github.com/txthinking/brook/releases/download/v20200502/brook_linux_amd64

RUN chmod a+x /usr/bin/bore /usr/bin/brook
RUN ln -f /usr/share/zoneinfo/PRC /etc/localtime
