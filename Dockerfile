FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY package*.json ./
RUN npm install
COPY . .
ARG START_SCRIPT=start:local
ARG ENV_FILE_CONTENT=""
ARG ENV_FILE_NAME=".env"
ENV START_SCRIPT=${START_SCRIPT}
RUN echo -e "$ENV_FILE_CONTENT" > $ENV_FILE_NAME && npm run build
EXPOSE 8080
CMD ["sh", "-c", "npm run $START_SCRIPT"]
