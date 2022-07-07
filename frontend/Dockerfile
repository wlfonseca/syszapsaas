FROM node:16.14.2 as build-deps
WORKDIR /usr/src/app
COPY ./ /usr/src/app/
RUN cp -i .env-exemple .env
RUN npm install
RUN npm run build


EXPOSE 3000
CMD node server.js