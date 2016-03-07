const joi = require('joi');
const pkg = require('../../package.json');
const boom = require('boom');
const Repository = require('./js/repository.js');
const Transform = require('./js/transform.js');

exports.register = function(server, options, next) {
    "use strict";
    // Create DB client
    // Add Joi validations here so we do not have to repeat it
    const joiClient = joi.string().required().description('Client ID');
    const joiDebug = joi.boolean().optional().default(false, 'Debug flag');
    const joiId = joi.string().token().required().description('Test ID');
    const joiSearch = {
        fname: joi.string(),
        lname: joi.string(),
        email: joi.string(),
        address: joi.string(),
        company: joi.string(),
        page: joi.number().integer().min(1).default(1),
        size: joi.number().integer().min(1).max(100).default(10),
        sort: joi.string().valid(['newest', 'oldest', 'asc', 'desc']).default('newest')
    };
    // Create client object
    const repo = new Repository();
    const transform = new Transform();
    // Routes setup
    server.route([
        {
            path: '/api/contacts/{id}',
            method: 'GET',
            handler: function(request, reply) {
                reply('*** GET COMING SOON ***');
            },
            config: {
                validate: {
                    params: {
                        id: joiId
                    },
                    query: {
                        client_id: joiClient,
                        debug: joiDebug
                        // PUT MORE VALIDATION HERE
                    }
                },
                tags: ['api', 'contact'],
                description: 'Get a single contact'
            }
        },
        {
            path: '/api/contacts',
            method: 'POST',
            handler: function(request, reply) {
                reply('*** CREATE COMING SOON ***');
            },
            config: {
                validate: {
                    payload: {
                        name: joi.string().required().description('Sample name'),
                        description: joi.string().required().description('Sample description')
                        // PUT MORE VALIDATION HERE
                    },
                    query: {
                        client_id: joiClient,
                        debug: joiDebug
                    }
                },
                tags: ['api', 'contact'],
                description: 'Create a new contact'
            }
        },
        {
            path: '/api/contacts/{id}',
            method: 'PUT',
            handler: function(request, reply) {
                reply('*** UPDATE COMING SOON ***');
            },
            config: {
                validate: {
                    params: {
                        id: joiId
                    },
                    payload: {
                        name: joi.string().optional().description('Sample name'),
                        description: joi.string().optional().description('Sample description')
                    },
                    query: {
                        client_id: joiClient,
                        debug: joiDebug
                    }
                },
                tags: ['api', 'contact'],
                description: 'Update a contact'
            }
        },
        {
            path: '/api/contacts/{id}',
            method: 'DELETE',
            handler: function(request, reply) {
                reply('*** DELETE COMING SOON ***');
            },
            config: {
                validate: {
                    params: {
                        id: joiId
                    },
                    query: {
                        client_id: joiClient,
                        debug: joiDebug
                    }
                },
                tags: ['api', 'contact'],
                description: 'Remove Contact'
            }
        },
        {
            path: '/api/contacts/list',
            method: 'POST',
            handler: function(request, reply) {
                repo.list(request.payload)
                    .then((x) => { return transform.list(x); })
                    .then(reply)
                    .catch(function (err) {
                        reply(boom.wrap(err, 400));
                    });
            },
            config: {
                validate: {
                    payload: joiSearch
                },
                tags: ['api', 'search', 'contacts'],
                description: 'Search for contacts'
            }
        },
        {
            path: '/api/contacts/detail/{id}',
            method: 'GET',
            handler: function(request, reply) {
                repo.detail(request.params.id)
                    .then((x) => { return transform.detail(x); })
                    .then(reply)
                    .catch(function (err) {
                        reply(boom.wrap(err, 400));
                    });
            },
            config: {
                validate: {
                    params: {
                        id: joi.string().regex(/[A-Za-z0-9\-]+/)
                    }
                },
                tags: ['api', 'show', 'contacts'],
                description: 'Data for selected contact to show'
            }
        },
        {
            path: '/contacts',
            method: 'GET',
            handler: function(request, reply) {
                repo.list(request.query)
                    .then((x) => {  return transform.list(x); })
                    .then((x) => { return reply(request.server.app.renderView('contacts-page', x)); })
                    .catch(function (err) {
                        reply(boom.wrap(err, 400));
                    });
            },
            config: {
                validate: {
                    query: joiSearch
                },
                tags: ['contacts', 'html'],
                description: 'Contacts web page'
            }
        },
        {
            path: '/contact-detail/{id}',
            method: 'GET',
            handler: function(request, reply) {
                repo.detail(request.params.id)
                    .then((x) => { return transform.detail(x); })
                    .then((x) => { return reply(request.server.app.renderView('contacts-page', x)); })
                    .catch(function (err) {
                        reply(boom.wrap(err, 400));
                    });
            },
            config: {
                validate: {
                    params: {
                        id: joi.string().regex(/[A-Za-z0-9\-]+/)
                    }
                },
                tags: ['contacts', 'html'],
                description: 'Contacts web page detail view'
            }
        },
        {
            path: '/restricted/contacts/tests/{file*}',
            method: 'GET',
            handler: function(request, reply) {
                return reply(request.server.app.renderView(request.params.file));
            },
            config: {
                validate: {
                    params: {
                        file: joi.string().default('contacts-test')
                    }
                },
                tags: ['contacts', 'html', 'test'],
                description: 'Contacts test web pages'
            }
        },
        {
            method: 'GET',
            path: '/restricted/contacts/assets/{param*}',
            handler: {
                directory: {
                    path: "plugins/contacts",
                    listing: true,
                    index: true
                }
            },
            config: {
                tags: ['assets', 'test'],
                description: 'Contacts test assets endpoint'
            }
        }
    ]);

    next();
};

exports.register.attributes = {
    pkg: {
        name: 'contacts',
        version: pkg.version,
        description: 'Endpoints for Contacts plugin',
        main: 'index.js'
    }
};
