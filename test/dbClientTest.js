"use strict";

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const DbClient = require('../lib/dbClient.js');
const cfg = require('../config.json');
const client = new DbClient({ mongoUrl: cfg.mongoUrl });

lab.experiment('DbClient: ', function () {

    lab.test('stats()', function (done) {
        client.stats().then(function (result) {
            console.log(result);
            done();
        }).catch(function (err) {
            console.error(err);
            done();
        });
    });
});
