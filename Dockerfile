
# # 依赖node对应的版本号
# FROM node:16.14.2-alpine3.14

# # RUN apk --update add tzdata && \
# #     cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
# #     echo "Asia/Shanghai" > /etc/timezone && \
# #     apk del tzdata && \
# #     rm -rf /var/cache/apk/*

# docker 构建过程中会将参数 DOCKER_ENV 传入
# docker build -t ${DOCKER_REGISTRY} --build-arg DOCKER_ENV=${DOCKER_ENV} .

# ENV projectName=html-web-service-platform
# WORKDIR /usr/local/lib/$projectName
# COPY ./ ./

# ENTRYPOINT ["node", "app.js"]


# 指定基础镜像，必须为第一个命令
# 可以使用镜像ID或者镜像名称 例如 nginx:1.14
FROM nginx:latest


ARG DOCKER_ENV
ENV DOCKER_ENV=${DOCKER_ENV}


# 将本地文件添加到容器中
# 将dist文件中的内容复制到 /usr/local/nginx/html/ 这个目录下面，该路径是nginx容器生成的一个虚拟路径，你的项目会存在这里。
COPY dist/  /usr/local/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
# 构建镜像时执行的命令
# RUN echo 'echo init ok!!'
# ENTRYPOINT ["echo", "'echo init ok!!'"]

ENTRYPOINT ["nginx", "-g", "daemon off;"]
