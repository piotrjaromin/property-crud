'use strict';

const config = require('config');
const should = require('should');
const axios = require('axios');

const HttpStatus = require('http-status-codes');

const {validProperty, invalidAirbnbIDProperty} = require('../tests/fixtures/properties');
const anotherOwner = 'anotherTestOwner';

const headers = {
  'Content-type': 'application/json',
};

describe('For crud on properties should return', () => {
  it('bad request for empty object', () => {
    return axios.post(config.propertiesUrl, {}, {headers})
        .then( () => {
          should.fail('For missing request body test should return 400');
        }).catch( ({response: {status, data}}) => {
          status.should.equal(HttpStatus.BAD_REQUEST);
          should.exist(data.msg);
          should.exist(data.details);
          data.details.should.be.Array();
          data.details.should.have.length(9);

          const invalidFields = data.details.map( (err) => err.field ).sort();
          should(invalidFields).be.eql(
              [
                'owner', 'address.line4', 'address.line1', 'address.postCode',
                'numberOfBedRooms', 'numberOfBathRooms', 'incomeGenerated',
                'address.city', 'address.country',
              ]
                  .sort());
        });
  });

  it('return not found for not existing object', () => {
    return testOn404();
  });

  it('bad request when airbnbID is invalid', () => {
    return axios.post(config.propertiesUrl, invalidAirbnbIDProperty, {headers})
        .then( () => {
          should.fail('For invalid airbnb test should return 400');
        }).catch( ({response: {status}}) => {
          status.should.equal(HttpStatus.BAD_REQUEST);
        });
  });

  it('create new property', () => {
    return axios.post(config.propertiesUrl, validProperty, {headers})
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.CREATED);
          data.should.deepEqual(validProperty);
        });
  });

  it('return conflict if property with given owner already exists', () => {
    return axios.post(config.propertiesUrl, validProperty, {headers})
        .then( () => should.fail('should fail for duplicate owner'))
        .catch( ({response: {status}}) => {
          status.should.equal(HttpStatus.CONFLICT);
        });
  });

  it('get newly created property', () => {
    return axios.get(`${config.propertiesUrl}/${validProperty.owner}`)
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.OK);
          data.should.be.Object();
          data.should.deepEqual(validProperty);
        });
  });

  it('allow for another new property', () => {
    const anotherProperty = Object.assign({}, validProperty, {owner: anotherOwner});
    return axios.post(config.propertiesUrl, anotherProperty, {headers})
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.CREATED);
          anotherProperty.should.deepEqual(data);
        });
  });

  it('list all properties', () => {
    return axios.get(`${config.propertiesUrl}`)
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.OK);
          data.should.be.Array();
          data.should.have.length(2);
        });
  });

  it('update existing property', () => {
    const url = `${config.propertiesUrl}/${validProperty.owner}`;

    const address = Object.assign({}, validProperty.address, {line2: 'line2', line3: 'another line'});
    const update = Object.assign({}, validProperty, {address, numberOfBedRooms: 15, numberOfBathRooms: 20});

    return axios.put(url, update, {headers})
        .then( ({status}) => status.should.equal(HttpStatus.NO_CONTENT))
        .then( () => axios.get(url))
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.OK);
          data.should.deepEqual(update);
        })
        .catch(logTestError);
  });

  it('not found for update of not existing property', () => {
    const update = Object.assign({}, validProperty, {owner: 'notExistingid'});
    return axios.put(`${config.propertiesUrl}/${update.owner}`, update, {headers})
        .then( () => {
          should.fail('For not existing owner test should return 404');
        }).catch( ( {response: {status}} ) => {
          status.should.equal(HttpStatus.NOT_FOUND);
        })
        .catch(logTestError);
  });


  it('delete existing property', () => {
    return Promise.all([deleteProperty(anotherOwner), deleteProperty(validProperty.owner)]);
  });

  it('404 for deleted entity', () => {
    return testOn404();
  });

  it('do not list deleted properties', () => {
    return axios.get(`${config.propertiesUrl}`)
        .then( ({data, status}) => {
          status.should.equal(HttpStatus.OK);
          data.should.be.Array();
          data.should.have.length(0);
        });
  });

  function testOn404() {
    return axios.get(`${config.propertiesUrl}/${validProperty.owner}`)
        .then( () => {
          should.fail('For not existing owner test should return 404');
        }).catch( ({response: {status}}) => {
          status.should.equal(HttpStatus.NOT_FOUND);
        });
  }

  function deleteProperty(owner) {
    return axios.delete(`${config.propertiesUrl}/${owner}`)
        .then( ({status}) => {
          status.should.equal(HttpStatus.NO_CONTENT);
        });
  }

  function logTestError(err) {
    if (err.response ) {
      console.log(`Request error, status ${err.response.status}, Body `, err.response.data);
    } else {
      console.log('Test error: ', err);
    }

    return Promise.reject(err);
  }
});
