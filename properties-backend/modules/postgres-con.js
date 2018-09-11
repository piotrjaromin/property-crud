'use strict';

const knex = require('knex');

const PROPERTIES = 'properties';
const PROPERTIES_HISTORY = 'properties_history';

const ADDRESS_FIELD_PREFIX = 'address';

function init(logger, config) {
  const db = knex({
    client: 'pg',
    connection: config,
  });

  return Promise.resolve()
      .then(() => db.schema.hasTable( PROPERTIES ) )
      .then( (propertisExists) => {
        if ( propertisExists ) {
          logger.info('Properties table exists, skipping create');
          return;
        }
        logger.info('Creating properties table');
        return createPropertiesTable(logger, db);
      })
      .then(() => db.schema.hasTable( PROPERTIES_HISTORY ) )
      .then( (propertisHistoryExists) => {
        if ( propertisHistoryExists ) {
          logger.info('Properties_history table exists, skipping create');
          return;
        }
        logger.info('Creating properties_history table');
        return createPropertiesHistoryTable(logger, db);
      })
      .then( () => db);
}

function createPropertiesTable(logger, db) {
  return db.schema.createTable(PROPERTIES, (table) => {
    table.string('owner').primary();
    // Property table
    table.string('airbnbID');
    table.integer('numberOfBedRooms').notNullable();
    table.integer('numberOfBathRooms').notNullable();
    table.integer('incomeGenerated').notNullable();

    // address fields
    table.string(`${ADDRESS_FIELD_PREFIX}_line1`).notNullable();
    table.string(`${ADDRESS_FIELD_PREFIX}_line2`);
    table.string(`${ADDRESS_FIELD_PREFIX}_line3`);
    table.string(`${ADDRESS_FIELD_PREFIX}_line4`).notNullable();
    table.string(`${ADDRESS_FIELD_PREFIX}_postCode`).notNullable();
    table.string(`${ADDRESS_FIELD_PREFIX}_city`).notNullable();
    table.string(`${ADDRESS_FIELD_PREFIX}_country`).notNullable();
  }).catch((err) => {
    logger.error('Error while creating properties table. ', err);
    return Promise.reject(err);
  }).then( () => db);
}

// TODO get rid of duplication
function createPropertiesHistoryTable(logger, db) {
  return db.schema.createTable(PROPERTIES_HISTORY, (table) => {
    table.string('owner').notNullable().index();
    table.increments('index').primary();
    table.timestamp('timestamp');
    table.string('operation');

    // Property table
    table.string('airbnbID');
    table.integer('numberOfBedRooms');
    table.integer('numberOfBathRooms');
    table.integer('incomeGenerated');

    // address fields
    table.string(`${ADDRESS_FIELD_PREFIX}_line1`);
    table.string(`${ADDRESS_FIELD_PREFIX}_line2`);
    table.string(`${ADDRESS_FIELD_PREFIX}_line3`);
    table.string(`${ADDRESS_FIELD_PREFIX}_line4`);
    table.string(`${ADDRESS_FIELD_PREFIX}_postCode`);
    table.string(`${ADDRESS_FIELD_PREFIX}_city`);
    table.string(`${ADDRESS_FIELD_PREFIX}_country`);
  }).catch((err) => {
    logger.error('Error while creating properties table. ', err);
    return Promise.reject(err);
  }).then( () => db);
}

module.exports.init = init;
module.exports.ADDRESS_FIELD_PREFIX = ADDRESS_FIELD_PREFIX;
module.exports.PROPERTIES = PROPERTIES;
module.exports.PROPERTIES_HISTORY = PROPERTIES_HISTORY;
