FROM debian:buster-slim as production-stage

ARG APP_ENV
ARG APP_NAME="public-api"
ARG APP_VERSION="1.0"
ARG JAR_FILE="${APP_NAME}-${APP_VERSION}.jar"
ARG WORK_DIR="/home/sl/public-api"

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl logrotate awscli python3-pip software-properties-common

RUN curl -fsSL https://apt.corretto.aws/corretto.key | apt-key add -
RUN add-apt-repository 'deb https://apt.corretto.aws stable main'

RUN apt-get update && \
    apt-get install -y java-17-amazon-corretto-jdk vim procps net-tools iputils-ping jq && \
    rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --gecos '' sl
RUN mkdir -p "${WORK_DIR}"

RUN { \
        echo '#!/bin/bash'; \
        echo "echo 'it happened'"; \
    } > /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh

WORKDIR "${WORK_DIR}"
COPY "/build/libs/${JAR_FILE}" "public-api.jar"
RUN chown -R sl:sl "${WORK_DIR}"

RUN echo 1
EXPOSE 8080
ENV RUN_IN_CONTAINER="True"
ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/app.sh && java -jar public-api.jar"]
