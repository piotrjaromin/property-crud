'use strict';

const express = require('express');
const middlewares = require('../modules/middlewares');

function create(propertyHandlers) {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get('/properties', propertyHandlers.get());
  router.post('/properties', middlewares.jsonContentMiddleware, propertyHandlers.post());

  router.get('/properties/:id', propertyHandlers.getSingle('id'));
  router.delete('/properties/:id', propertyHandlers.deleteSingle('id'));
  router.put('/properties/:id', middlewares.jsonContentMiddleware, propertyHandlers.putSingle('id'));

  router.get('/properties/:id/history', propertyHandlers.historyForSingle('id'));
  return router;
}


module.exports.create = create;
