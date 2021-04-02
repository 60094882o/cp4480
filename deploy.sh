#!/bin/bash

echo deploying messaging app client files
rm /var/www/deploy/cp4480project/client/ -rf
rm /opt/deploy/cp4480project/server/ -rf

mkdir /var/www/deploy/cp4480project/client
mkdir /opt/deploy/cp4480project/server

cp ./server.js /opt/deploy/cp4480project/server
cd /opt/deploy/cp4480project/server
npm i

dir(webfiles)
terser $(dir) -o /var/www/deploy/cp4480project/client/messaging.min.js

systemctl reload nginx.service
echo deployment successful