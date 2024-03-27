# price-comparison-client1

## Intro


## Project setup
```
source vue-env/bin/activate
nvm use 18
npm install
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
