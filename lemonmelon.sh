#! bin/bash

echo "
BOT_TOKEN=$BOT_TOKEN
WEBSOCKET_URL=$WEBSOCKET_URL
FFMP=$FFMP
" >> .env

npm start
