'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const logger = require('simple-node-logger').createSimpleLogger();
const cors = require('cors');

logger.setLevel(process.env.LOG_LEVEL || 'info');

// First connect to database, then start application
require('../modules/postgres-con')
    .init(logger, config.get('postgres'))
    .then(initApp)
    .catch( (err) => {
      logger.error('Error while starting app. Details: ', err);
    });

function initApp(db) {
  const app = express();

  // all origins allowed
  app.use(cors());
  app.use(bodyParser.json());

  // init business endpoints
  require('../modules/properties/properties-init')(app, logger, config, db);

  // error handler
  app.use(require('../modules/middlewares').errorMiddleware(logger));

  const port = config.get('port');
  app.listen(port, () => logger.info('listening on port ', port));
}
