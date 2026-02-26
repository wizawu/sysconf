FROM ubuntu:25.10

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        python3.13 \
        python3-pip \
        ca-certificates \
        curl \
        git \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple
RUN pip install --break-system-packages --no-cache-dir kimi-cli==1.12.0 pandas openpyxl
