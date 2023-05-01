#!/bin/bash

set -e
cd /opt/docker/dev-itravel
# 清除
sudo rm -rf ./www/*

# 解压，跳过头层
sudo tar -zxvf ./tmp/dist.tar.gz -C ./www --strip-components=1

# 构建 docker
cd ./www
sudo docker build -t dev-itravel .

# 停止并删除
sudo docker stop dev-itravel && sudo docker rm dev-itravel

# 运行
sudo bash /root/docker-script/docker-dev-itravel.sh
