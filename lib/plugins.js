"use strict";

const pkg = require('../package.json');
const plugins = [];

// Add plugins required for hapi to work properly with swagger and static folders
plugins.push({ register: require('inert') });
plugins.push({ register: require('vision') });
// Add routes
plugins.push({ register: require('./routes.js') });

/*
  Interactive tool for REST Api testing
  https://github.com/glennjones/hapi-swagger
  https://github.com/swagger-api/swagger-ui
*/
plugins.push({
    register: require('hapi-swagger'),
    options: {
        documentationPath: '/restricted/docs',
        info: {
          title: 'Api endpoints',
          version: pkg.version
        }
    }
});

/* Contacts endpoints */
plugins.push({
    register: require('../plugins/contacts/index.js'),
    options: {
        version: pkg.version
    }
});

module.exports = plugins;