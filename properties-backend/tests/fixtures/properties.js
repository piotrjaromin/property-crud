'use strict';

const validProperty = {
  owner: 'testHost',
  address: {
    line1: 'line1 value',
    line4: 'line4 value',
    postCode: '1234Code',
    city: 'Warsaw',
    country: 'Poland',
  },
  numberOfBedRooms: 2,
  numberOfBathRooms: 1,
  airbnbID: '2354700',
  incomeGenerated: 500,
};

const validWithAllFields = Object.assign({}, validProperty, {line2: 'second line', line3: 'third line'});
const invalidAirbnbIDProperty = Object.assign({}, validProperty, {owner: 'ownerWithInvalidAirbnb', airbnbID: 'some_random_number'});

module.exports.validProperty = validProperty;
module.exports.validWithAllFields = validWithAllFields;
module.exports.invalidAirbnbIDProperty = invalidAirbnbIDProperty;
