'use strict';

const axios = require('axios');
const config = require('../../config/default.json');

let backendUrl = config.backendUrl;
//workaround when no backendUrl is provided
//assume that backend is running on the same host as frontend and on port 3001
//help when someone uses docker-machine instead of native one
if ( !backendUrl ) {
    backendUrl = `${location.protocol}//${window.location.hostname}:3001`;
}

const httpClient = axios.create({
  baseURL: `${backendUrl}/properties`,
  timeout: 1000,
  headers: {
      "content-type": "application/json"
  }
});

function create(property) {

    return httpClient.post(``, property);
}


function update(id, property) {

    return httpClient.put(`/${id}`, property);
}

function del(id) {

    return httpClient.delete(`/${id}`)
}

function getSingle(id) {

    return httpClient.get(`/${id}`)
}

function get() {
    return httpClient.get(``).then( resp => resp.data);
}

module.exports.create = create;
module.exports.delete = del;
module.exports.update = update;
module.exports.get = get;
module.exports.getSingle = getSingle;
