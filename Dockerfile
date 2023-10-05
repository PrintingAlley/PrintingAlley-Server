FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package*.json ./
RUN npm install
COPY . .
ARG BUILD_SCRIPT=build
ARG ENV_FILE_CONTENT
ARG ENV_FILE_NAME
# 여러 줄의 ENV로 인한 오류를 방지하기 위해 따옴표로 감싸줌
RUN echo "$ENV_FILE_CONTENT" > $ENV_FILE_NAME && npm run $BUILD_SCRIPT
EXPOSE 8080
CMD [ "node", "dist/main.js" ]
