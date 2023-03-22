# 基础镜像
FROM node:18

# 端口
EXPOSE 7000

# 工作目录
WORKDIR /www

# 缓存镜像层，只要 package.json无变化，docker就会从这一个缓存镜像层中直接复制node_modules
COPY package.json /www/package.json

# 安装依赖
RUN npm install --no-frozen-lockfile --ignore-scripts

# 复制文件到容器 ~/www
COPY . .

# 复制配置文件
COPY ../config/* ./

# 构建项目
RUN npm run build:prod

# 启动命令
CMD ["npm", "run", "start:prod"]
