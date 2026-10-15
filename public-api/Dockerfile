# =========================================================================
# STAGE 1: Build the application using Gradle
# =========================================================================
FROM gradle:7.6-jdk17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy only the dependency configuration files first to leverage Docker layer caching
COPY build.gradle settings.gradle ./

# Copy the actual application source code
COPY src ./src

# Compile the application and build the fat/shadow JAR without running tests
RUN gradle bootJar --no-daemon -x test

# =========================================================================
# STAGE 2: Deploy and run the application using a lightweight JRE
# =========================================================================
FROM eclipse-temurin:17-jre-jammy AS deploy

ARG APP_ENV
ARG APP_NAME="public-api"
ARG APP_VERSION="1.0.0"
ARG JAR_FILE="${APP_NAME}-${APP_VERSION}.jar"
ARG WORK_DIR="/home/javauser"

# Create a non-root system user for security compliance
RUN addgroup --system javauser && useradd --create-home --home-dir ${WORK_DIR} --gid javauser --shell /bin/bash javauser

RUN { \
        echo '#!/bin/bash'; \
        echo "echo 'it happened'"; \
    } > /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh

WORKDIR "${WORK_DIR}"

RUN mkdir "${APP_NAME}"
COPY --from=build "/app/build/libs/${JAR_FILE}" "${APP_NAME}/${APP_NAME}.jar"
RUN chown -R javauser:javauser "${WORK_DIR}"

# AWS Lambda Web Adapter: proxies Lambda (API Gateway) events to the app on $PORT
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

USER javauser

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"
ENV RUN_IN_CONTAINER="True"
ENV PORT=8080
ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/app.sh && cd ${APP_NAME} && java ${JAVA_OPTS} -jar ${APP_NAME}.jar"]
