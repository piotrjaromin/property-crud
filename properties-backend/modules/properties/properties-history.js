'use strict';

const {PROPERTIES_HISTORY} = require('../postgres-con');

const eventTypes = {
  CREATED: 'created',
  DELETED: 'deleted',
  UPDATED: 'updated',
};

function create(logger, db, emitter) {
  logger.debug('History service created');

  register(eventTypes.CREATED);
  register(eventTypes.DELETED);
  register(eventTypes.UPDATED);

  function register(type) {
    emitter.on(type, handleEvent(type));
  }


  function handleEvent(type) {
    return (data) => {
      db(PROPERTIES_HISTORY)
          .insert(Object.assign({}, data, {operation: type, timestamp: new Date()} ))
          .catch( (err) => {
            logger.error('Error while adding new history event error ', err);
          });
    };
  }

  function historyFor(owner) {
    return db(PROPERTIES_HISTORY)
        .where('owner', owner)
        .select()
        .orderBy('timestamp', 'desc');
  }

  return {
    historyFor,
  };
}


module.exports.create = create;
module.exports.eventTypes = eventTypes;
