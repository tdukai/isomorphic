"use strict";

const boom = require('boom');
const PageModel = require('./pageModel.js');

/* Calculates page offset */
const getOffset = function getOffset (page, size) {
    var result = 0;
    if (page > 1) {
        result = (page -1) * size;
    }
    return result;
};

/* Get sorting method */
const getSortMethod = function getSortMethod (sort) {
    var result;
    if (sort === 'newest') {
        result = function (a, b) {
            if (a.touchpoint.modified_date > b.touchpoint.modified_date) {
                return 1;
            }
            if (a.touchpoint.modified_date < b.touchpoint.modified_date) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    } else if (sort === 'oldest') {
        result = function (a, b) { 
            if (b.touchpoint.modified_date > a.touchpoint.modified_date) {
                return 1;
            }
            if (b.touchpoint.modified_date < a.touchpoint.modified_date) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    } else if (sort === 'asc') {
        result = function (a, b) {
            if (a.contact.firstName > b.contact.firstName) {
                return 1;
            }
            if (a.contact.firstName < b.contact.firstName) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    } else if (sort === 'desc') {
        result = function (a, b) { 
            if (b.contact.firstName > a.contact.firstName) {
                return 1;
            }
            if (b.contact.firstName < a.contact.firstName) {
                return -1;
            }
            // a must be equal to b
            return 0; 
        };
    }
    return result;
};

/**
* Repository client for contacts API
*
* @class Repository
* @constructor
* @param {object} options
*/
class Repository {

    /**
    * Returns a single contact entity by id
    *
    * @method read
    * @params {string} id - entity id
    *
    * @return {object} Promise object
    */
    read (id) {
        return id;
    }

    /**
    * Creates a single contact entity
    *
    * @method create
    * @params {object} entity - data to create contact
    *
    * @return {object} Promise object
    */
    create (entity) {
        return entity;
    }

    /**
    * Updates a single contact entity
    *
    * @method update
    * @params {string} id - entity id
    *
    * @return {object} Promise object
    */
    update (entity) {
        return entity;
    }

    /**
    * Removes a single contact entity by id
    *
    * @method remove
    * @params {string} id - entity id
    *
    * @return {object} Promise object
    */
    remove (id) {
        return id;
    }

    /**
    * Returns multiple contacts based on some filters and sorting
    *
    * @method list
    * @params {object} params - search and paging parameters
    *
    * @return {object} Promise object
    */
    list (params) {
        /* Get the page offset */
        return new Promise(function (resolve, reject) {
            // Mimic service load
            // Load data
            const data = require('../test/data.json');
            if (Array.isArray(data)) {
                var sortFunc = getSortMethod(params.sort);
                data.sort(sortFunc);
                var result = new PageModel({
                    paging: {
                        page: params.page,
                        size: params.size,
                        sort: params.sort,
                        count: data.length
                    },
                    contacts: []
                });
                // Get the page
                var fr = getOffset(params.page, params.size);
                var to = (fr + params.size) > data.length ? data.length : params.size;
                for (var i = fr; i < to; i++) {
                    result.contacts.push(data[i]);
                }
                //return resolve(result);
                setTimeout(function() {
                    return resolve(result);
                }, 200); // Temporally adds 200ms time to fake real service time
            } else {
                return reject(boom.badData('JSON file not found'));
            }
        });
    }

    /**
    * Returns a selected contact entity by id
    *
    * @method detail
    * @params {string} id - entity id
    *
    * @return {object} Promise object
    */
    detail (id) {
        return new Promise(function (resolve, reject) {
            const data = require('../test/data.json');
            if (Array.isArray(data)) {
                var entity = null;
                data.forEach(function (item) {
                    if (item.contact && item.contact.contactId === id && entity === null) {
                        entity = item;
                    }
                });
                var result = new PageModel(entity);
                //return resolve(result);
                setTimeout(function() {
                    return resolve(result);
                }, 200); // Temporally adds 250ms time to fake real service time
            } else {
                return reject(boom.badData('JSON file not found'));
            }
        });
    }
}

module.exports = Repository;