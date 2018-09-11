'use strict';

const model = require('./properties-model');
const errors = require('../errors');

function create(propertiesService, propertyValidator, propertyHistory) {
  function get() {
    return (req, res, next) =>{
      // TODO pagination would be nice
      propertiesService
          .get()
          .then( (properties) => res.status(200).send(properties))
          .catch(next);
    };
  }

  function post() {
    return (req, res, next) =>{
      const newProperty = new model.Property(req.body);

      propertyValidator.validate(newProperty)
          .then((validationErrors) => {
            if (validationErrors ) {
              return Promise.reject(new errors.BadRequest('Invalid payload sent', validationErrors));
            }

            return propertiesService.create(newProperty);
          })
          .then( () => res.status(201).json(newProperty))
          .catch(next);
    };
  }

  function getSingle(idParam) {
    return (req, res, next) =>{
      const owner = req.params[idParam];

      propertiesService
          .getByOwner(owner)
          .then( (property) => {
            res.status(200).json(property);
          })
          .catch(next);
    };
  }

  function deleteSingle(idParam) {
    return (req, res, next) =>{
      const owner = req.params[idParam];
      propertiesService
          .deleteByOwner(owner)
          .then(() => res.status(204).end())
          .catch(next);
    };
  }

  function putSingle(idParam) {
    return (req, res, next) =>{
      const updatedProperty = new model.Property(req.body);
      const owner = req.params[idParam];

      propertyValidator.validate(updatedProperty)
          .then((validationErrors) => {
            if (validationErrors ) {
              return Promise.reject(new errors.BadRequest('Invalid payload sent', validationErrors));
            }
            return propertiesService
                .updateByOwner(owner, updatedProperty)
                .then( () => res.status(204).end());
          })
          .catch(next);
    };
  }

  function historyForSingle(idParam) {
    return (req, res, next) => {
      const owner = req.params[idParam];

      return propertyHistory.historyFor(owner)
          .then( (history) => {
            res.status(200).json(history);
          })
          .catch(next);
    };
  }
  return {
    get,
    post,
    getSingle,
    deleteSingle,
    putSingle,
    historyForSingle,
  };
}

module.exports.create = create;
