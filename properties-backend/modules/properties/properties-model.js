'use strict';

const {ADDRESS_FIELD_PREFIX} = require('../postgres-con');
const ADDRESS_FIELD_PREFIX_LENGTH = ADDRESS_FIELD_PREFIX.length;

class Address {
  constructor(params) {
    this.line1 = params.line1;
    this.line2 = params.line2;
    this.line3 = params.line3;
    this.line4 = params.line4;
    this.postCode = params.postCode;
    this.city = params.city;
    this.country = params.country;
  }
}

class Property {
  constructor(params) {
    this.owner = params.owner;
    this.address = new Address(params.address || {});
    this.numberOfBedRooms = params.numberOfBedRooms;
    this.numberOfBathRooms = params.numberOfBathRooms;
    this.airbnbID = params.airbnbID;
    this.incomeGenerated = params.incomeGenerated;
  }

  // Converts Property object so it can be stored in database
  toDbEntity() {
    const entity = Object.assign({}, this);
    delete entity.address;
    Object.keys(this.address).forEach( (key) => {
      entity[`${ADDRESS_FIELD_PREFIX}_${key}`] = this.address[key];
    });

    return entity;
  }

  // Creates Property object from database result
  static fromDbEntity(entity) {
    const address = {};
    Object.keys(entity)
        .filter( (key) => key.startsWith(`${ADDRESS_FIELD_PREFIX}_`))
        .forEach( (key) => {
          if ( entity[key] ) {
            address[key.substring(ADDRESS_FIELD_PREFIX_LENGTH + 1)] = entity[key];
          }
        });

    return new Property({
      ...entity,
      address,
    });
  }
}


module.exports.Property = Property;
