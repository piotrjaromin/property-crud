'use strict';

const Joi = require('joi');

const HttpStatus = require('http-status-codes');

const addressSchema = Joi.object({
  line1: Joi.string().required(),
  line2: Joi.string(),
  line3: Joi.string(),
  line4: Joi.string().required(),
  postCode: Joi.string().min(1).max(100).required(),
  city: Joi.string().alphanum().min(1).max(100).required(),
  country: Joi.string().alphanum().min(1).max(100).required(),
});


const propertySchema = Joi.object({
  owner: Joi.string().alphanum().min(1).required(),
  address: addressSchema.required(),
  numberOfBedRooms: Joi.number().integer().min(0).required(),
  numberOfBathRooms: Joi.number().integer().min(1).required(),
  airbnbID: Joi.string(),
  incomeGenerated: Joi.number().integer().min(1).required(),
});

function create(logger, config, cache, axios) {
  // Either returns false value when everything is okay
  // or array containing errors
  function validate(property) {
    const {error} = Joi.validate(property, propertySchema, {abortEarly: false});
    if ( error ) {
      return Promise.resolve(mapJoiError(error));
    }

    if ( property.airbnbID ) {
      // if body is valid call airbnb, but check cache first
      return cache.get(property.airbnbID)
          .then( (value) => {
            if (value) {
              // valid value in cache
              return false;
            }
            // cache miss
            return validateAirbnbId(property.airbnbID);
          });
    }

    return Promise.resolve(false);
  }

  function validateAirbnbId(airbnbID) {
    return axios.head(`${config.get('airbnb.roomsUrl')}/${airbnbID}`)
        .then( () => cache.set(airbnbID, true))
        .then( () => false)
        .catch( ({response: {status}}) => {
          if ( status == HttpStatus.NOT_FOUND ) {
            return [fieldError(`${airbnbID} airbnb id does not exists`, 'airbnbID')];
          }

          logger.warn('Invalid response from airbnb, status code ', status);
          return [fieldError('Invalid response from airbnb. Please try again later', 'airbnbID')];
        });
  }

  function mapJoiError(error) {
    return error.details.map((detail) => fieldError(detail.message, detail.path.join('.')));
  }

  function fieldError(msg, field) {
    return {message: msg, field: field};
  }
  return {
    validate,
  };
}

module.exports.create = create;
