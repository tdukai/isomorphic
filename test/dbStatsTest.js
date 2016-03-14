"use strict";

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const DbStats = require('../lib/dbStats.js');
const stats = new DbStats();

lab.experiment('Db-Stats: ', function () {

    lab.test('counts', function (done) {
        stats.counts().then(function (result) {
            console.log(result);
            done();
        });
    });

});
