# Property backend

rest backend service created, by default starts on port 3001.
Application uses postgres sql as database, to start empty database run `./start-db.sh`, this will start docker container with properties table in postgres, also default user/password will match those stored in configuration.

Configuration is stored in `./conig` directory.
Code starting whole app is in `./bin/www.js` file.
Modules used by this app are in `./modules` directory.
Routes defined by application can be found in `./routes/properties-endpoint.js`.

## TODO'S

- more unit tests
- pagination for get endpoints
- adding diff for history endpoint
- think of removing knex init database and write normal sql
- better handling of large integers (switch to bigint)

## Running application

To run application:

```bash
npm i
./start-db.sh # run only if postgres is not configured on localhost
npm start
```

to run unit tests:

```bash
npm run test
```

to run integration tests application must be started:

```bash
npm run test-integration
```


## Docker

Dockerfile uses multi stage build which will also run unit tests and linter.

to build docker image run:

```bash
docker build -t property-backend .
```

There is also docker-compose but it fails at first start of application because of postgres is initialization:

```bash
docker-compose build
docker-compose up
```