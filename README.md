# price comparison public api

Research project website: https://shopleech.com/

### Requirements

```text
openjdk 17.x LTS
node >= 24.x LTS
Gradle >= 7.x
```

### Projects

- `public-api`: The backend API for the price comparison application.
- `price-comparison-client1`: The frontend client for the price comparison application.
 
### Start local development environment
~~~
cd public-api
docker compose -f ../docker-compose-db.yml up --build
./gradlew flywayMigrate
./run.sh
cd ../price-comparison-client1
npm run serve
~~~
