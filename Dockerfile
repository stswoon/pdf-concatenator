FROM node:22.11.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY index.html tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
RUN npm run build


FROM nginx:1.27.3
COPY --from=builder /app/dist ./usr/share/nginx/html
COPY start.sh /etc/nginx/
RUN chmod +x /etc/nginx/start.sh
ARG NGINX_PORT
EXPOSE $NGINX_PORT
CMD ["/etc/nginx/start.sh"]


# docker build . -t pdf-concat
# docker run --rm --name pdf-concat -p 8085:8085 -e NGINX_PORT=8085 pdf-concat