FROM node:alpine
MAINTAINER Mikhael Lollo <mikhael@lollo.fr> \
LABEL description="Seekfriendback container" \
LABEL version="0.1.0"
WORKDIR /usr/src/app
COPY . .
RUN npm update && npm install
EXPOSE 8080
ENTRYPOINT ["npm", "start", "--" ]
CMD ["port=8080", "mongodb_ip=localhost"]
