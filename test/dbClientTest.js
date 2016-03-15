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
            expect(result).to.be.a('object');
            expect(result.total).to.be.a('number');
            expect(result.female).to.be.a('number');
            expect(result.male).to.be.a('number');
            expect(result.divorced).to.be.a('number');
            expect(result.country).to.be.a('number');
            expect(result.region).to.be.a('number');
            expect(result.city).to.be.a('number');
            done();
        }).catch(function (err) {
            console.error(err);
            done();
        });
    });


});
