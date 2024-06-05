# 使用轻量级的Node.js alpine镜像作为基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /app

# 复制前端package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装前端依赖
RUN npm install

# 复制前端代码
COPY . .

# 构建前端
RUN npm run build

# 切换到server目录，安装后端依赖
WORKDIR /app/server

# 复制后端package.json和package-lock.json
COPY server/package.json server/package-lock.json ./

# 安装后端依赖
RUN npm install

# 复制后端代码
COPY server/server.js .

# 设置工作目录回到根目录
WORKDIR /app

# 将构建的前端静态文件复制到server的public目录
RUN cp -r /app/build /app/server/public

# 暴露前端和后端端口
EXPOSE 80 8088

# 启动后端服务
CMD ["node", "server/server.js"]
