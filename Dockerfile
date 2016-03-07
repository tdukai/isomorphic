FROM node

ADD package.json /tmp/package.json
ADD .npmrccorp /tmp/.npmrccorp
RUN cd /tmp && npm --userconfig=.npmrccorp i --silent

USER root

WORKDIR /src

COPY . ./

RUN rm -rf node_modules/
RUN mv /tmp/node_modules .
RUN ./node_modules/.bin/gulp

EXPOSE 8000

CMD [ "node", "index.js" ]
