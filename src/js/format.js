/*global window, module */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
    isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');


/**
* Format utilities
* @class tools.Format
* @constructor
*/
var Format = function () {};

/**
* Simple check if the value is not “undefined” 
*
* @method hasValue
*/
Format.prototype.hasValue = function hasValue (value) {
    return (value !== undefined && value !== null);
};

/**
* Returns a string representation of the type of the object. Passible values: “String”, “Array”, “Function”, “Boolean”, “Number”
*
* @method getType
*/
Format.prototype.getType = function getType (obj) {
    return !!obj && Object.prototype.toString.call(obj).match(/(\w+)\]/)[1];
};

/**
* Adds thousands separators
*
* @method addSeparators
* @param {number} number 
* @return {string} number converted to string containing the thousand separator characaters
*/
Format.prototype.addSeparators = function addSeparators (number) {
    var regex = /(\d+)(\d{3})/;
    number = this.hasValue(number) && number !== "" ? number : 0;
    number = number.toString();
    while (regex.test(number)) {
        number = number.replace(regex, '$1' + ',' + '$2');
    }
    return number;
};

/**
* Abbreviates large numbers to short thousands/million format 10k.. 1.2M etc.
*
* @method abbreviateNumber
* @param {number} value 
* @return {string} short version of number
*/
Format.prototype.abbreviateNumber = function abbreviateNumber (value) { /* Formats large numbers to Xk or XM format */
    value = this.hasValue(value) && value !== "" ? value : 0;
    var result = value.toString(), // coerce to string
    mode = "";
    value = parseInt(value, 10);
    // Calculate abbreviation
    if (value >= 1000 && value < 1000000) {
        value = Math.floor(value / 1000);
        if (value < 1000) {
            mode = "k";
        } else {
            value = Math.floor(value / 1000);
            mode = "M";
        }
    } else if (value >= 1000000) {
        value = Math.floor(value / 1000);
        value = Math.floor(value / 10);
        value = (value / 100).toFixed(2);
        mode = "M";
    }
    // Convert result
    result = value.toString();
    // Suppress last zero digits
    if (result.indexOf(".00") > -1) {
        result = result.substr(0, result.indexOf(".00"));
    }
    // Suppress last empty digit (zero)
    if (result.indexOf('.') > -1 && result.substr(result.length-1, 1) === "0") {
        result = result.substr(0, result.length-1);
    }
    result += mode;
    return result;
};

/**
* Formatting phone number to standard 
*
* @method formatPhone
* @param {string} phoneRaw value
* @return {string} stanard formatted value
*/
Format.prototype.formatPhone = function formatPhone (phoneRaw) {
    phoneRaw = phoneRaw === undefined ? "" : phoneRaw;
    var regexObj = /^(?:\+?1[\-. ]?)?(?:\(?([0-9]{3})\)?[\-. ]?)?([0-9]{3})[\-. ]?([0-9]{4})$/;
    if (regexObj.test(phoneRaw)) {
        var parts = phoneRaw.match(regexObj);
        var phone = "";
        if (parts[1]) {
            phone += "+1 (" + parts[1] + ") ";
        }
        phone += parts[2] + "-" + parts[3];
        return phone;
    } else {
        //invalid phone number
        return phoneRaw;
    }
};


if (isBrowser) {
    window.tools = window.tools || {};
    window.tools.Format = Format;
} else if (isNode) {
    module.exports = Format;
}