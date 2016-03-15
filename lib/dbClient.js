"use strict";

const mongodb = require('mongodb');
var local = {};

/* Returns total and gender count */
local.userCounts = function userCounts (db) {
    return new Promise(function (resolve, reject) {
        db.collection('people').aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]).toArray(function (err, data) {
            if (err !== null) {
                reject(err);
            } else {
                // Adjust format and add total count
                var total = 0;
                var result = {};
                data.forEach(function (item) {
                    result[item._id] = item.count;
                    total += item.count;
                });
                result.total = total;
                resolve(result);
            }
        });
    });
};

/* Number of divorced members */
local.getCount = function getCount (db, query) {
    return new Promise(function (resolve) {
        var count = db.collection('people').count(query);
        resolve(count);
    });
};

/* Lookup list */
local.getDistinct = function getDistinct (db, field) {
    return new Promise(function (resolve) {
        var list = db.collection('people').distinct(field);
        resolve(list);
    });
};

/**
* Data from database for dashboard
*
* @class DbClient
* @constructor
* @param {object} options
*/
class DbClient {

    /* Constructor */
    constructor(options) {
        this.options = options;
    }

    /**
    * Autocomplete search method
    *
    * @method lookup
    * @param {string} field - database field (country, region, city, postalCode)
    * @param {string} search - phrase (first couple of letters to match on)
    * @param {number} limit - maximum number of results expected
    *
    * @return {object} Promise object
    */
    lookup (field, search, limit) {
        var url = this.options.mongoUrl;
        return new Promise(function (resolve, reject) {
            mongodb.MongoClient.connect(url).then(function (db) {
                var query = {};
                query[field] = new RegExp('^' + search, 'i');
                db.collection('people').find(query, { limit: limit, sort: field });
            }).catch(reject);
        });
    }

    /**
    * Returns the count of requested query
    *
    * @method count
    * @param {object} query
    *
    * @return {object} Promise object
    */
    count (query) {
        var url = this.options.mongoUrl;
        return new Promise(function (resolve, reject) {
            mongodb.MongoClient.connect(url).then(function (db) {
                var count = local.getCount(db, query);
                resolve(count);
            }).catch(reject);
        });
    }

    /**
    * Returns a stats and lookup info
    *
    * @method stats
    *
    * @return {object} Promise object
    */
    stats () {
        var url = this.options.mongoUrl;
        return new Promise(function (resolve, reject) {
            mongodb.MongoClient.connect(url).then(function (db) {
                var tasks = [],
                result;
                // Add the tasks
                tasks.push(local.userCounts(db));
                tasks.push(local.getCount(db, { maritalStatus: 'Divorced' }));
                tasks.push(local.getDistinct(db, 'region'));
                tasks.push(local.getDistinct(db, 'city'));
                tasks.push(local.getDistinct(db, 'country'));
                // Wait for all
                Promise.all(tasks).then(function (results) {
                    // Get calculated counts
                    result = results[0];
                    result.divorced = results[1];
                    result.region = results[2].length;
                    result.city = results[3].length;
                    result.country = results[4].length;
                    return resolve(result);
                }).catch(reject);
            }).catch(reject);
        });
    }
}

module.exports = DbClient;