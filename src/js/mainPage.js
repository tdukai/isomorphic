/*global window */
"use strict";

/**
* MainPage
* @class pages.MainPage
* @constructor
*/
var MainPage = function (options) {
    var self = this;

    /**
    * @property options - storing input options
    */
    self.options = options || {};

    /**
    * Init page logic
    *
    * @method init
    */
    self.init = function init () {

    };
};

window.pages = window.pages || {};
window.pages.MainPage = MainPage;