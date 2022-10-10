# https://github.com/hetykai/docker_pg_jieba/blob/master/Dockerfile
FROM postgres:14.1-alpine

RUN apk add --no-cache --virtual .fetch-deps ca-certificates cmake git openssl tar \
  && git clone --shallow-since=2021-08-01T00:00:00 https://github.com/jaiminpan/pg_jieba \
  && apk add --no-cache --virtual .build-deps gcc g++ libc-dev make postgresql-dev \
  && apk add --no-cache --virtual .rundeps libstdc++ \
  && cd /pg_jieba \
  && git checkout ec499c5e \
  && git submodule update --init --recursive \
  && mkdir build \
  && cd build \
  && cmake .. \
  && make \
  && make install \
  && apk del .build-deps .fetch-deps \
  && rm -rf /usr/src/postgresql /pg_jieba \
  && find /usr/local -name '*.a' -delete

RUN ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY init.sql /docker-entrypoint-initdb.d/init.sql
