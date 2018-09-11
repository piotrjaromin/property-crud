'use strict';

require('should');

const model = require('../../modules/properties/properties-model');

const {validProperty, validWithAllFields} = require('../fixtures/properties');

describe('Property model should', () => {
  it('Correctly convert to and from db entity', () => {
    testFor(validProperty);
  });

  it('Correctly convert to and from db entity, when all fields are present', () => {
    testFor(validWithAllFields);
  });

  function testFor(prop) {
    const property = new model.Property(prop);
    const dbEntity = property.toDbEntity();
    const convertedBack = model.Property.fromDbEntity(dbEntity);
    property.should.deepEqual(convertedBack);
  }
});
