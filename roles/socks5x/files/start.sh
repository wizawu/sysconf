#!/bin/bash

echo "deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu focal main universe" > /etc/apt/sources.list
apt update -o Acquire::AllowInsecureRepositories=true -y
apt install --allow-unauthenticated --no-install-recommends -y libc6=2.31-0ubuntu9
npm run start
