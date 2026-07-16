FROM ubuntu:25.10

ENV DEBIAN_FRONTEND=noninteractive
RUN sed -i 's|http://.*.ubuntu.com/ubuntu|http://mirrors.tuna.tsinghua.edu.cn/ubuntu|g' /etc/apt/sources.list.d/ubuntu.sources
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        python3.13 \
        python3-pip \
        ca-certificates \
        curl \
        git \
        jq \
        wget \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN test -f /usr/bin/python || ln -sf /usr/bin/python3 /usr/bin/python
ENV PIP_BREAK_SYSTEM_PACKAGES=1
ENV PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install --no-cache-dir playwright==1.58.0 beautifulsoup4 easyofd lxml markdown markdownify openpyxl pandas pdfplumber pillow pyotp pypdfium2 python-docx pyyaml requests

ENV PLAYWRIGHT_BROWSERS_PATH=/var/lib/playwright
RUN playwright install --with-deps chromium
ENV CHROME_EXECUTABLE_PATH=/var/lib/playwright/chromium-1208/chrome-linux64/chrome

# https://github.com/MoonshotAI/kimi-code/releases
RUN wget -q -O /usr/bin/kimi https://code.kimi.com/kimi-code/binaries/0.26.0/kimi-code-linux-x64 && \
    chmod +x /usr/bin/kimi

# https://github.com/earendil-works/pi/releases
RUN wget -q -O- https://github.com/earendil-works/pi/releases/download/v0.80.8/pi-linux-x64.tar.gz | \
    tar zxf - -C /usr/local && \
    ln -sf /usr/local/pi/pi /usr/bin/pi

# https://qoder.com/en/changelog?type=cli
RUN wget -q -O- https://qoder-ide.oss-accelerate.aliyuncs.com/qodercli/releases/1.0.47/qodercli-linux-x64.tar.gz | \
    tar zxf - -C /usr/bin && \
    mv /usr/bin/qodercli /usr/bin/qoder

RUN chmod 755 /usr/bin

RUN mkdir -p /home/wizawu/.agents && \
    git clone --depth 1 https://github.com/anthropics/skills.git /tmp/skills && \
    rm -rf /tmp/skills/skills/claude-api && \
    mv /tmp/skills/skills /home/wizawu/.agents/skills && \
    rm -rf /tmp/skills && \
    mkdir /home/wizawu/.agents/skills/browser

COPY browser/SKILL.md browser/browse.py /home/wizawu/.agents/skills/browser/
