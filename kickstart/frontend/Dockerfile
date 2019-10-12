FROM node:12-buster AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build:prod

FROM nginx:1-alpine

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD envsubst < /usr/share/nginx/html/assets/config/config.docker.json > /usr/share/nginx/html/assets/config/config.json && exec nginx -g 'daemon off;'


