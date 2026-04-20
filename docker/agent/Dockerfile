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
RUN pip install --no-cache-dir kimi-cli==1.36.0 playwright==1.58.0 beautifulsoup4 easyofd lxml openpyxl pandas pdfplumber pillow pypdfium2 pyyaml reportlab

ENV PLAYWRIGHT_BROWSERS_PATH=/var/lib/playwright
RUN playwright install --with-deps chromium
ENV CHROME_EXECUTABLE_PATH=/var/lib/playwright/chromium-1208/chrome-linux64/chrome

RUN mkdir -p /home/wizawu
RUN git clone --depth 1 https://github.com/anthropics/skills.git /home/wizawu/.claude
