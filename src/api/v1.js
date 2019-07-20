'use strict';

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

router.param('model', modelFinder.load);

router.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});

router.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);
router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

// Route Handlers

/**
 *
 * Finds and returns everything
 * @route GET /api/v1/:model
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} an object with the number of entries in the db and their contents. 
 */
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 *
 * Gets the entry with the id requested
 * @route GET /api/v1/:model/:id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} the object with the id requested
 */
function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 *
 * Creates a new entry in the db
 * @route POST /api/v1/:model
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} the entry created
 */
function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *
 * finds an object by id and updates it, then returns the object
 * @route PUT /api/v1/:model/:id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} the updated entry
 */
function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *
 * Deletes the entry based on the id passed in
 * @route DELETE /api/v1/:model/:id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} nothing
 */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;
