# price comparison public api

Research project website: https://shopleech.com/

## Project setup

#### requirements

```text
openjdk version "17.0.5" 2022-10-18 LTS
node v15.14.0
Gradle 7.6
```

#### add configuration to application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jpa_demo
spring.datasource.username=
spring.datasource.password=
spring.datasource.hikari.schema=public
```

#### update flyway configuration in to gradle

```
flyway {
    url = 'jdbc:postgresql://localhost:5432/jpa_demo'
    user = ''
    password = ''
    schemas = ['public']
}
```

#### migrate db

```bash
./gradlew flywayInfo
./gradlew flywayMigrate
```

### Compiles and run for development

```bash
java -jar build/libs/public-api-1.0.jar com.shopleech.publicapi.PublicapiApplication
```

### Compiles and minifies for production

```bash
./gradlew build
./gradlew bootJar
```

### Run your unit tests

```bash
./gradlew test
```

### Run your container

#### build docker image

```bash
docker build --build-arg APP_ENV=production -t sl-public-api .
```

#### run docker image locally

```bash
docker run -it -p 8080:8080 --rm sl-public-api
```

#### tag docker image and upload to aws ecr

```bash
docker tag sl-public-api:latest XXXX.dkr.ecr.eu-west-1.amazonaws.com/sl-public-api:latest-prod
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin XXXX.dkr.ecr.eu-west-1.amazonaws.com
docker push XXXX.dkr.ecr.eu-west-1.amazonaws.com/sl-public-api:latest-prod
```
