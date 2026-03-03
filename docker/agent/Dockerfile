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

ENV PIP_BREAK_SYSTEM_PACKAGES=1
ENV PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install --no-cache-dir kimi-cli==1.16.0 beautifulsoup4 lxml openpyxl pandas pillow pypdfium2 pyyaml
