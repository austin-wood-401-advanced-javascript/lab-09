'use strict';

const Model = require('../mongo.js');
const schema = require('./shopping-schema.js.js');

class Shopping extends Model {
  constructor() { super(schema); }
}

module.exports = Shopping;

