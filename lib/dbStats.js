"use strict";

const mongodb = require('mongodb');
const config = require('../config.json');

/* Temporally handling errors here (later proper logging) */
function handleError (err) {
    if (err) {
        console.error(err);
    }
}

/* Gets the total user counts */
function userCounts (db) {
    return new Promise(function (resolve)) {
        var result = db.collection('people').count();
        resolve(result);
    });
}

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
    * Returns a selected contact entity by id
    *
    * @method detail
    * @params {string} id - entity id
    *
    * @return {object} Promise object
    */
    counts (id) {
        return new Promise(function (resolve, reject) {
            mongodb.MongoClient.connect(config.mongoUrl).then(function (db) {
                userCounts(db).then(function (result) {
                    console.log(result);
                }).catch(handleError);
            });
            
        });
    }
}

module.exports = DbStats;