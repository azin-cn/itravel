# 基础镜像
FROM node:18

# 端口
EXPOSE 7000

# 工作目录
WORKDIR ~/www

# 复制文件到容器 ~/www
COPY /opt/docker/dev-itravel/www/* ./

# 安装依赖并构建
RUN pnpm install --no-frozen-lockfile --ignore-scripts
RUN pnpm build:prod

# 启动命令
CMD ["pnpm", "start:prod"]
