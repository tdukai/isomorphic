/*global window, tools, bimo */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
    isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var Model = isNode ? require('bimo').Model : bimo.Model;
var Format = isNode ? require('./format.js') : tools.Format;


/**
* PageModel 
* @class models.PageModel
* @constructor
*/
var PageModel = function (data) {
    Model.call(this, data);
    this.counts = new Model(data.counts);
    this._format = new Format();
};

PageModel.prototype = Object.create(Model.prototype);
PageModel.constructor = Model;

/* Check mode */
PageModel.prototype.isDashboard = function isDashboard () {
    return (this.mode === 'dashboard');
};

/* Format the count */
PageModel.prototype.formatCount = function formatCount(name) {
    var result = 'na';
    if (this.counts && this.counts[name]) {
        result = this._format.addSeparators(this.counts[name]);
    }
    return result;
};

PageModel.prototype.userCount = function userCount() {
    return this.formatCount('total');
};

PageModel.prototype.femaleCount = function femaleCount() {
    return this.formatCount('female');
};

PageModel.prototype.maleCount = function maleCount() {
    return this.formatCount('male');
};

PageModel.prototype.countryCount = function countryCount() {
    return this.formatCount('country');
};

PageModel.prototype.regionCount = function regionCount() {
    return this.formatCount('region');
};

PageModel.prototype.cityCount = function cityCount() {
    return this.formatCount('city');
};

PageModel.prototype.divorcedPercent = function divorcedPercent () {
    var result = 'na';
    if (this.counts && this.counts.total && this.counts.divorced) {
        result = ((this.counts.divorced / this.counts.total) * 100).toFixed(1) + '%';
    }
    return result;
};

if (isBrowser) {
    window.models = window.models || {};
    window.models.PageModel = PageModel;
} else if (isNode) {
    module.exports = PageModel;
}