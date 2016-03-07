/*global window, module */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

/**
* Contacts single paging model
* @class ContactsPagingModel
* @constructor
*/
var ContactsPagingModel = function (data) {
    data = data || {};
    this.page = data.page ? parseInt(data.page, 10) : 0;
    this.size = data.size ? parseInt(data.size, 10) : 0;
    this.sort = data.sort || '';
    this.count = data.count || 0;
};

/* Calculate page count */
ContactsPagingModel.prototype.pageCount = function pageCount () {
    var result = this.count / this.size;
    if (this.count <= this.size) {
        result = 1;
    } else {
        result = Math.floor(this.count / this.size);
        var r = this.count % this.size; 
        if (r > 0) {
            result++;
        }
    }
    return result;
};

/* Check if multiple pages exists */
ContactsPagingModel.prototype.hasNext = function hasNext () {
    return (this.page < (this.count / this.size));
};

/* Checks if we are on next page */
ContactsPagingModel.prototype.hasPrev = function hasPrev () {
    return (this.page > 1);
};

/* Next page */
ContactsPagingModel.prototype.next = function next () {
    var result = false;
    if (this.page < this.pageCount()) {
        this.page++;
        result = true;
    }
    return result;
};

/* Previous page */
ContactsPagingModel.prototype.prev = function prev() {
    var result = false;
    if (this.page > 1) {
        this.page--;
        result = true;
    }
    return result;
};

/* First page */
ContactsPagingModel.prototype.first = function first () {
    this.page = 1;
    return true;
};

/* Last page */
ContactsPagingModel.prototype.last = function last () {
    this.page = this.pageCount();
    return true;
};

if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsPagingModel = ContactsPagingModel;
} else if (isNode) {
    module.exports = ContactsPagingModel;
}
