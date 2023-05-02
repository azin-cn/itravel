#!/bin/bash

set -e
cd /opt/docker/dev-itravel

# 清除代码文件，静态文件在 ./upload，不进入docker
sudo rm -rf ./www/*

# 解压，跳过头层
sudo tar -zxvf ./tmp/dist.tar.gz -C ./www --strip-components=1

# 移动原有的upload，覆盖
sudo rsync -a ./www/upload ./

# 复制 config
sudo cp -r ./config ./www

# 构建 docker
cd ./www
sudo docker build -t dev-itravel .


# 停止并删除，当容器不存在时会报错，需要加以判断
if [ "$(docker ps -a -q -f name=^dev-itravel$)" ]; then
  sudo docker stop dev-itravel
  sudo docker rm dev-itravel
fi

# 删除无用 none 镜像，必须要无任何使用的情况下
if [ "$(sudo docker images -f "dangling=true" -q)" ]; then
  sudo docker rmi $(docker images -f "dangling=true" -q)
fi

# 运行
sudo bash /root/docker-script/docker-dev-itravel.sh
