/*global window */
"use strict";

/**
* Generic utility to manage url on the client side
* @class RealUrl
* @constructor
*/
var RealUrl = function RealUrl () {};

/**
* Parsing the query values into key-value format
*
* @method parse
* @param {string} url - optional: when not specified it will use location.href
* @return {string} query value (undefined if not exists)
*/
RealUrl.prototype.parse = function parse (url) {
    var result = {},
    list;
    url = (url === undefined) ? (typeof window !== 'undefined' ? window.location.href : '') : url;
    if (url) {
        // Get the part after the question mark
        if (url.indexOf('?') > -1) {
            list = url.split('?');
            url = list[1]; // Need content after the question mark
        }
        // Check for hash exists then get the part before
        if (url.indexOf('#') > -1) {
            list = url.split('#');
            url = list[0]; // Need values before the hash
        }

        // Split all the parameters
        list = url.split('&');
        for (var key in list) {
            if (list.hasOwnProperty(key)) {
                var parts = list[key].split('=');
                result[parts[0]] = parts[1];
            }
        }
    }
    return result;
};

/**
* Gets the specified query value from url
*
* @method getQueryValue
* @param {string} name - query parameter name 
* @param {string} url - optional: when not specified it will use location.href
* @return {string} query value (undefined if not exists)
*/
RealUrl.prototype.getQueryValue = function (name, url) {
    var result,
    values;
    url = (url === undefined) ? (typeof window !== 'undefined' ? window.location.href : '') : url;
    if (url) {
        values = this.parse(url);
        // Split all the parameters
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                if (key === name) {
                    result = values[key];
                    break;
                }
            }
        }
    }
    return result;
};

/**
* Updates the url and the query parameters
*
* @method setQueryValue
* @param {string} name - query parameter name 
* @param {string} value - query parameter value
* @param {string} url - optional: when not specified it will use location.href
* @return {undefined}
*/
RealUrl.prototype.setQueryValue = function (name, value, url) {
    url = (url === undefined) ? (typeof window !== 'undefined' ? window.location.href : '') : url;
    var temp = this.getQueryValue(name, url),
    hash = url.indexOf('#') > -1 ? url.split('#')[1] : "",
    separator = url.indexOf('?')  > -1 ? '&' : '?',
    oldParam,
    newParam,
    result = url;
    // Exists
    if (temp && temp !== value && name && value) {
        oldParam = [name, '=', temp].join('');
        newParam = [name, '=', value].join('');
        result = result.replace(oldParam, newParam);
    } else if (temp === undefined && name && value) {
        if (hash !== "") {
            result = result.replace(hash, ''); // Remove hash
        }
        hash = (hash === "") ? "" : ['#', hash].join(''); // Add hashmark if needed
        result = [result, separator, name, '=', value, hash].join(''); // Add the new value
    }
    return result;
};

/**
* Provides a base url
*
* @method host
* @param {string} path - additonal path elements to add to the base url
* @return {string} url
*/
RealUrl.prototype.host = function host (path) {
    var result = [
        window.location.protocol, '//', 
        window.location.hostname,
        window.location.port === '' ? '' : ':', 
        window.location.port
    ];
    if (path) {
        result.push(path);
    }
    return result.join('');
};

/**
* Updates the url 
*
* @method update
* @param {object} key value representation of values pushed into the url
* @param {string} url - if not specified using window.location object to retrive it
* @return {undefined} 
*/
RealUrl.prototype.update = function update (values, url) {
    values = values || {};
    url = (url === undefined) ? window.location.href : url;
    // Apply additional value
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            url = this.setQueryValue(key, values[key], url);
        }
    }
    // Add to the page
    if (typeof window !== 'undefined' && typeof window.history !== 'undefined' && window.history.pushState && url) {
        var newUrl = url,
        oldUrl = window.location.href,
        baseUrl = this.host();
        // Check if the url is full
        if (url.indexOf(baseUrl) === -1) {
            newUrl = [baseUrl, (url[0] === '/') ? '' : '/', url].join('');
        }
        // Push to history only if not the same
        if (newUrl !== oldUrl) {
            window.history.pushState({ path: newUrl },'', newUrl);
        }
    }
};

window.move = window.move || {};
window.move.RealUrl = RealUrl;