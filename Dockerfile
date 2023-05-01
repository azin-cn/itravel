# 基础镜像
FROM node:18-buster-slim

# 端口
EXPOSE 7000

# 工作目录
WORKDIR /www

# 缓存镜像层，只要 package.json无变化，docker就会从这一个缓存镜像层中直接复制node_modules
COPY package.json /www/package.json

# WARNING 下载依赖过多 npm socket 自动报超时错误
# 安装依赖，高版本的npm（7）弱依赖冲突会终止安装，使用 npm install --legacy-peer-deps
RUN npm install --no-frozen-lockfile --ignore-scripts --legacy-peer-deps

# 复制文件到容器 ~/www
COPY . .

# 复制配置文件，docker复制宿主机的文件最好是在Dockerfile以下的目录
COPY ./config/* ./

# 构建项目
RUN npm run build:prod

# 启动命令
CMD ["npm", "run", "start:prod"]
