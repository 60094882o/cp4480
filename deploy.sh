#!/bin/bash

echo deploying messaging app client files
rm /var/www/deploy/cp4480project/client/ -r
rm /opt/deploy/cp4480project/server/ -r

mkdir /var/www/deploy/cp4480project/client
mkdir /opt/deploy/cp4480project/server

cp ./server.js /opt/deploy/cp4480project/server
cd /opt/deploy/cp4480project/server
npm i

terser webfiles/*.js > ./messaging.min.js
cp ./messaging.min.js /var/www/deploy/cp4480project/client

systemctl reload nginx.service
echo deployment successful