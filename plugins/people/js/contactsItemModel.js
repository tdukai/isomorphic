/*global window, module */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

/**
* Contacts single item model
* @class ContactsItemModel
* @constructor
*/
var ContactsItemModel = function (data) {
    data = data || {};
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            this[key] = data[key];
        }
    }
};


/* Provides initals for contact icon */
ContactsItemModel.prototype.initials = function initials () {
    var result = '';
    if (this.firstName) {
        result += this.firstName.substring(0, 1).toUpperCase();
    }
    if (this.lastName) {
        result += this.lastName.substring(0, 1).toUpperCase();
    }
    if (result === '') {
        result = '??';
    }
    return result;
};

/* Provides full name */
ContactsItemModel.prototype.fullName = function fullName () {
    var result = 'n/a';
    if (this.firstName && this.lastName) {
        result = [this.firstName, this.lastName].join(' ');
    }
    return result;
};

/* Checks if mode is inquiry */
ContactsItemModel.prototype.isInquiry = function isInquiry () {
    return (this.mode === 'INQUIRY');
};

/* Checks if mode is contact */
ContactsItemModel.prototype.isContact = function isContact () {
    return (this.mode === 'CONTACT');
};

/* Displays proper date format */
ContactsItemModel.prototype.displayDate = function displayDate () {
    var result;
    if (this.date) {
        var d = new Date(this.date);
        result = d.toLocaleDateString();
    }
    return result;
};


if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsItemModel = ContactsItemModel;
} else if (isNode) {
    module.exports = ContactsItemModel;
}