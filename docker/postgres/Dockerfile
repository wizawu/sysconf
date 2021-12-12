# https://github.com/hetykai/docker_pg_jieba/blob/master/Dockerfile
FROM xxxx.mirror.aliyuncs.com/library/postgres:14.1-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.cloud.tencent.com/' /etc/apk/repositories && sed -i 's/http:/https:/' /etc/apk/repositories

RUN set -ex \
  && apk add --no-cache --virtual .fetch-deps ca-certificates cmake git openssl tar \
  && git clone https://github.com/jaiminpan/pg_jieba \
  && apk add --no-cache --virtual .build-deps gcc g++ libc-dev make postgresql-dev \
  && apk add --no-cache --virtual .rundeps libstdc++ \
  && cd /pg_jieba \
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
