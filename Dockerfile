FROM nginx:1.29-alpine
ARG UID=1001

# Update image
USER 0
RUN apk update && apk upgrade

RUN apk add --no-cache wget

# Create custom user (not root)
RUN  addgroup -g $UID pyro-platform  && \
     adduser -u $UID -G pyro-platform -D pyro-platform

RUN touch /run/nginx.pid \
 && chown -R pyro-platform:pyro-platform /run/nginx.pid /var/cache/nginx

# Copy of conf nginx
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy app build files
ARG APPLICATION_BUILD_PATH
COPY ${APPLICATION_BUILD_PATH}/dist /usr/share/nginx/html

USER pyro-platform
EXPOSE 8080

CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD curl -f -s localhost:8080 || exit 1