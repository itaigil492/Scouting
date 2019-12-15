FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@4.1.2

ENV HOME=/home/app

COPY package.json $HOME/scoutingreimagined/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/scoutingreimagined
RUN npm install

USER root
COPY . $HOME/scoutingreimagined
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "bin/www"]
