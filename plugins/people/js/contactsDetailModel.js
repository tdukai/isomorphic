/*global window, module, move */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var ContactsItemModel = isNode ? require('./contactsItemModel.js') : move.ContactsItemModel;

/**
* Contact detail model
* @class ContactsDetailModel
* @constructor
*/
var ContactsDetailModel = function (data) {
    ContactsItemModel.call(this, data);
    this.isDetail = true;
};

ContactsDetailModel.prototype = Object.create(ContactsItemModel.prototype);
ContactsDetailModel.constructor = ContactsItemModel;

/* Adds commas to numbers (thousand separator) */
ContactsDetailModel.prototype.addCommas = function addCommas (number) {
    var regex = /(\d+)(\d{3})/;
    number = number === undefined ? 0 : number;
    number = number.toString();
    while (regex.test(number)) {
        number = number.replace(regex, '$1' + ',' + '$2');
    }
    return number;
};

/* Display price */
ContactsDetailModel.prototype.displayPrice = function displayPrice () {
    var result = '$n/a';
    if (typeof this.price === 'number') {
        result = '$' + this.addCommas(this.price.toFixed(2));
    }
    return result;
};

/* Display beds */
ContactsDetailModel.prototype.displayBed = function displayBed () {
    var result = 'n/a';
    if (typeof this.bed === 'number') {
        result = this.bed.toString();
    }
    return result;
};

/* Display baths */
ContactsDetailModel.prototype.displayBath = function displayBath () {
    var result = 'n/a';
    if (typeof this.bath === 'number') {
        result = this.bath.toString();
    }
    return result;
};

/* Display sqft */
ContactsDetailModel.prototype.displaySqft = function displaySqft () {
    var result = 'n/a';
    if (typeof this.sqft === 'number') {
        result = this.addCommas(this.sqft);
    }
    return result;
};

if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsDetailModel = ContactsDetailModel;
} else if (isNode) {
    module.exports = ContactsDetailModel;
}