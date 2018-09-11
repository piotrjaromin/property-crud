'use strict';

const Promise = require('bluebird');
const errors = require('../errors');

const {Property} = require('./properties-model');
const {eventTypes} = require('./properties-history');
const {PROPERTIES} = require('../postgres-con');

const DUPLICATE_CONST_ERROR = /^error: duplicate key value violates unique constraint/;

function create(logger, db, events) {
  const properties = () => db(PROPERTIES);

  function get() {
    logger.debug('getting properties');
    // TODO pagination would be nice
    return properties()
        .select()
        .orderBy('owner', 'asc')
        .then((res) => res.map(Property.fromDbEntity));
  }

  function create(property) {
    logger.debug('creating new property');

    const dbEntity = property.toDbEntity();
    return properties()
        .insert(dbEntity)
        .then(() => events.emit(eventTypes.CREATED, dbEntity))
        .catch((e) => {
          if (isDuplicateError(e) ) {
            return Promise.reject(new errors.ConflictError('Property with given owner already exists'));
          }

          logger.error('Error while inserting new property ', e);
          return Promise.reject(new errors.InternalError('Unable to create given property'));
        });
  }

  function getByOwner(owner) {
    logger.debug('getting property by host ', owner);

    return properties()
        .where({
          owner,
        })
        .select()
        .then((res) => {
          if (res.length == 0) {
            return Promise.reject(new errors.NotFoundError(`Property with owner ${owner} does not exist`));
          }

          return res[0];
        })
        .then(Property.fromDbEntity);
  }

  function deleteByOwner(owner) {
    logger.debug('deleting property with owner ', owner);

    return properties()
        .where({
          owner,
        })
        .del()
        .then(() => events.emit(eventTypes.DELETED, {owner}));
  }

  function updateByOwner(owner, data) {
    logger.debug('updating task');

    return db.transaction( (t) => properties()
        .transacting(t)
        .where({
          owner,
        })
        .select('owner')
        .then( ([row]) => {
          if ( !row ) {
            return Promise.reject(new errors.NotFoundError(`Property with owner ${owner} does not exist`));
          }
          return;
        })
        .then( () => handleUpdate(t, owner, data))
    ).catch((e) => {
      if ( e instanceof errors.NotFoundError) {
        return Promise.reject(e);
      }

      logger.error('Error while updating property ', e);
      return Promise.reject(new errors.InternalError('Unable to update given property'));
    });
  }

  function handleUpdate(t, owner, data) {
    const dbEntity = data.toDbEntity();
    return properties()
        .transacting(t)
        .where({
          owner,
        })
        .update(dbEntity)
        .then(() => events.emit(eventTypes.UPDATED, dbEntity));
  }

  function isDuplicateError(err) {
    return DUPLICATE_CONST_ERROR.test(err.stack);
  }

  return {
    get,
    getByOwner,
    create,
    deleteByOwner,
    updateByOwner,
  };
}

module.exports.create = create;
