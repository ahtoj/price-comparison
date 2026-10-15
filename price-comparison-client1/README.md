# price-comparison-client1

## Intro

#### Requirements

```text
node >= 24.x LTS
```

## Project setup
```
python -m venv vue-env
source ./vue-env/bin/activate
# on Windows: .\vue-env\Scripts\activate.bat
npm install
```

#### add environment variables (or create .env file)

```
GOOGLE_CLIENT_ID=
VUE_APP_API_URL="http://localhost:8080"
```

Edit host in src/http-client.ts

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production + deploy to s3
```
npm run build

cd dist/
aws s3 async ./ s3://my-bucket
```

### Run production version locally
```
docker build -t sl-client .
docker run -it -p 8888:80 --rm sl-client
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```
