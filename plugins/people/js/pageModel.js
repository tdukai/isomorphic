"use strict";

const ContactsPagingModel = require('./contactsPagingModel.js');

/**
* Contacts Page rendering model
* @class PageModel
* @constructor
*/
const PageModel = function PageModel (data) {
    data = data || {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            this[key] = data[key];
        }
    }
    // Set detail mode false
    this.isDetail = false;
    // Create paging subcomponent
    this.paging = new ContactsPagingModel(data.paging);
};

module.exports = PageModel;