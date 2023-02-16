# DOcker file
FROM --platform=linux/amd64 node:14 as yarn_builder
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN mkdir -p /code
COPY . /code/
RUN cd /code/ && yarn
RUN cd /code/ && /bin/bash ./bin/tsc-all.sh
RUN cd /code/qp-explorer-node && npx webpack

FROM node:14.17.0-alpine3.12
ENV GOSU_VERSION 1.12

RUN apk add curl
# Install gosu
RUN set -eux; \
    \
    apk add --no-cache --virtual .gosu-deps \
        ca-certificates \
        dpkg \
        gnupg \
    ; \
    \
    dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
    wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
    wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
    \
# verify the signature
    export GNUPGHOME="$(mktemp -d)"; \
    gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
    gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
    command -v gpgconf && gpgconf --kill all || :; \
    rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
    \
# clean up fetch dependencies
    apk del --no-network .gosu-deps; \
    \
    chmod +x /usr/local/bin/gosu; \
# verify that the binary works
    gosu --version; \
    gosu nobody true

RUN mkdir /runner
RUN addgroup -S runners && adduser -S runner -G runners
COPY --from=yarn_builder /code/qp-explorer-node/target/index.js /runner/
RUN chown runner /runner
EXPOSE 8080
ENTRYPOINT ["gosu"]
CMD ["runner", "node", "/runner/index.js"]
