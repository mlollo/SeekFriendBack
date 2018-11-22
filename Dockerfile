FROM node:alpine
ENV WORKDIR /usr/src/app \
WORKDIR $WORKDIR
COPY . .
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "start"]
CMD ["--port:8080", "--mongodb_ip:localhost"]