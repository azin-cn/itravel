# 构建 docker
cd ./www
sudo docker build -t dev-itravel .

# 停止并删除
sudo docker stop dev-itravel && sudo docker rm dev-itravel

# 运行
sudo bash /root/docker-script/docker-dev-itravel.sh
