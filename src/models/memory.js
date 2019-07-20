'use strict';

const uuid = require('uuid/v4');

class Model {

  constructor() {
    this.database = [];
  }

  /**
   *
   * Finds and returns an object by id
   * @param {*} id
   * @returns object of id
   * @memberof Model
   */
  get(id) {
    let response = id ? this.database.filter((record) => record.id === id) : this.database;
    return Promise.resolve(response);
  }

  /**
   *
   * Creates a new entry in the db
   * @param {*} entry
   * @returns {entry}
   * @memberof Model
   */
  create(entry) {
    entry.id = uuid();
    let record = this.sanitize(entry);
    if (record.id) { this.database.push(record); }
    return Promise.resolve(record);
  }

  /**
   *
   * finds an object by id and updates it, then returns the object
   * @param {*} id
   * @param {*} entry
   * @returns {entry} 
   * @memberof Model
   */
  update(id, entry) {
    let record = this.sanitize(entry);
    if (record.id) { this.database = this.database.map((item) => (item.id === id) ? record : item); }
    return Promise.resolve(record);
  }

  /**
   *
   * deletes an object in the db based on db
   * @param {*} id
   * @returns {}
   * @memberof Model
   */
  delete(id) {
    this.database = this.database.filter((record) => record.id !== id);
    return Promise.resolve();
  }

  /**
   *
   * checks to make sure the entry is valid
   * @param {*} entry
   * @returns {*} true/false
   * @memberof Model
   */
  sanitize(entry) {

    let valid = true;
    let record = {};
    let schema = this.schema();

    Object.keys(schema).forEach(field => {
      if (schema[field].required) {
        if (entry[field]) {
          record[field] = entry[field];
        } else {
          valid = false;
        }
      }
      else {
        record[field] = entry[field];
      }
    });

    return valid ? record : undefined;
  }

}

module.exports = Model;
