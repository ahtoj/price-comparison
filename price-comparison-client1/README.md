# price-comparison-client1

## Intro


## Project setup
```
source vue-env/bin/activate
nvm use 18
npm install
```

Copy `.env.example` to `.env.local` or `.env.production` and update:

```text
VUE_APP_API_BASE_URL=
VUE_APP_GOOGLE_CLIENT_ID=
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production + deploy to S3
```
npm run build

cd dist/
aws s3 sync ./ s3://my-bucket --delete
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
