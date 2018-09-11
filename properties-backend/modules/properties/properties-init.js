'use strict';

const NodeCache = require('node-cache-promise');
const axios = require('axios');

const EventEmitter = require('events');
class Events extends EventEmitter {}


function initProperties(app, logger, config, db) {
  const events = new Events();
  const propertyHistory = require('../../modules/properties/properties-history').create(logger, db, events);

  const propertyService = require('../../modules/properties/properties-service').create(logger, db, events);

  const cache = new NodeCache(config.get('airbnb.cache'));
  const propertyValidator = require('../../modules/properties/properties-validator').create(logger, config, cache, axios);
  const propertyHandlers = require('../../modules/properties/properties-handlers').create(propertyService, propertyValidator, propertyHistory);

  app.use('/', require('../../routes/properties-endpoint').create(propertyHandlers));
}


module.exports = initProperties;
