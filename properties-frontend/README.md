# Property frontend

To run this application you need to start first property backend application on port 3001.

App has only one root('/') path  which contains form for creating new properties and below it you can find list of all properties.

## TODO's

- improving css (colors, form columns)
- better error handling
- moving create form to separate view
- better handling of refresh state
- remove alert duplication code
- fix uncontrolled component error from console

## running

to start application in dev mode:

```bash
npm i
npm start
```

## To build docker image

run:

```bash
npm i
npm build
docker build -t property-frontend .
```

Dependencies built by `npm build` command are stored in public directory
Docker image starts nginx (configuration is in file )on port 80 you can run it through:

```bash
docker run -p 80:80 property-frontend
```