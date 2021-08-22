FROM golang:1.15.0-alpine as intermediate
RUN apk add git
RUN go get github.com/wizawu/gotunnel

FROM node:14.16-buster-slim
COPY --from=intermediate /go/bin/gotunnel /usr/bin/gotunnel

RUN echo "deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu focal main universe" > /etc/apt/sources.list
RUN apt update -o Acquire::AllowInsecureRepositories=true -y && \
    apt install --allow-unauthenticated --no-install-recommends -y \
    libc6=2.31-0ubuntu9 \
    curl \
    wget \
    && \
    apt clean

RUN wget --no-check-certificate -q -O /usr/bin/brook \
    https://github.com/txthinking/brook/releases/download/v20200502/brook_linux_amd64
RUN chmod a+x /usr/bin/brook
