# price comparison public api

#### requirements

```text
openjdk 17.x LTS
node >= 24.x LTS
Gradle >= 7.x
```

#### add environment variables  (or create .env file)

```
DB_URL=jdbc:postgresql://localhost:5432/jpa_demo
DB_USERNAME=
DB_PASSWORD=
DB_SCHEMA=public
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=price-comparison-images
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

#### update flyway configuration in to gradle

```
flyway {
    url = 'jdbc:postgresql://mmdb.shopleech.com:9097/jpa_demo'
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
./run.sh
# on Windows: .\run.bat
```

### Compiles and minifies for production

```bash
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
