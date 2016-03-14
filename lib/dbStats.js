"use strict";

const mongodb = require('mongodb');
const config = require('../config.json');

function genderCount (db) {
    return new Promise(function (resolve, reject)) {
        db.collection('people').aggregate([
            {
                { 
                    $group: { 
                        _id: 'gender', 
                        count: { $sum: 1 }
                    }
                }
            }
        ]).then(resolve) {
        }).catch(reject);
    });
}


/**
* Statistical data from database for dashboard
*
* @class DbStats
* @constructor
* @param {object} options
*/
class DbStats {
    /**
    * Returns a stats and counts
    *
    * @method counts
    *
    * @return {object} Promise object
    */
    counts (id) {
        return new Promise(function (resolve, reject) {
            mongodb.MongoClient.connect(config.mongoUrl).then(function (db) {
                genderCount(db).then(resolve).catch(reject);
            });
        });
    }
}

module.exports = DbStats;