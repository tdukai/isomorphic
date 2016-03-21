"use strict";

const path = require('path');
const joi = require('joi');
const boom = require('boom');
const pkg = require('../package.json');
const folders = require('./folders.js');
const DbClient = require('./dbClient.js');
const PageModel = require('../src/js/pageModel.js');

exports.register = function(server, options, next) {
    // Routing
    // max-age=31536000 = 1 year
    const maxAge = 'max-age=5'; // 5 sec for testing purpose
    const client = new DbClient(options);
    server.route([
        {
            method: "GET",
            path: "/styles/{filename}",
            config: {
                description: "Serve css styles",
                handler: function (request, reply) {
                    return reply.file(path.join('public/css', request.params.filename),{ lookupCompressed: true }).header('cache-control', maxAge);
                },
                validate: {
                    params: {
                        filename: joi.string().regex(/^vendor-\d+.\d+.\d+.min.css|client-\d+.\d+.\d+.min.css|authenticate.min.css/)
                    }
                },
                tags: ['assets']
            }
        },
        {
            method: "GET",
            path: "/scripts/{filename}",
            config: {
                description: "Serve js scripts",
                handler: function (request, reply) {
                    return reply.file(path.join('public/js', request.params.filename), { lookupCompressed: true }).header('cache-control', maxAge);
                },
                validate: {
                    params: {
                        filename: joi.string().regex(/^vendor-\d+.\d+.\d+.min.js|client-\d+.\d+.\d+.min.js|client-\d+.\d+.\d+.js|views-\d+.\d+.\d+.min.js/)
                    }
                },
                tags: ['assets']
            }
        },
        {
            method: "GET",
            path: "/images/{filename}",
            config: {
                description: "Serves static images",
                handler: function (request, reply) {
                    return reply.file(path.join('public/img', request.params.filename)).header('cache-control', 'max-age=3600');
                },
                validate: {
                    params: {
                        filename: joi.string().regex(/^.*\.(bmp|tif|tiff|gif|jpeg|jpg|jif|jfif|jp2|jpx|j2k|j2c|fpx|pcd|png|svg|)$/)
                    }
                },
                tags: ['assets']
            }
        },
        {
            method: "GET",
            path: "/fonts/{filename}",
            config: {
                description: "Serves font resources",
                handler: function (request, reply) {
                    return reply.file(path.join('public/font', request.params.filename)).header('cache-control', 'max-age=3600');
                },
                validate: {
                    params: {
                        filename: joi.string().regex(/^.*\.(ttf|woff|woff2)$/)
                    }
                },
                tags: ['assets']
            }
        },
        {
            method: 'GET',
            path: '/authenticate',
            handler: function (request, reply) {
                return reply(request.server.app.renderView('authenticate'));
            },
            config: {
                tags: ['web']
            }
        },
        {
            method: 'POST',
            path: '/authenticate',
            handler: function (request, reply) {
                // *** PUT CODE HERE TO AUTHENTICATE
                return reply(request.server.app.renderView('authenticate'));
            },
            config: {
                validate: {
                    payload: {

                    }
                },
                tags: ['web']
            }
        },
        {
            method: 'GET',
            path: '/dashboard',
            handler: function (request, reply) {
                client.stats().then(function (counts) {
                    var model = new PageModel({
                        name: pkg.name,
                        version: pkg.version,
                        dashboard: true,
                        counts: counts
                    });
                    return reply(request.server.app.renderView('page', model));
                }).catch(function (err) {
                    return reply(boom.wrap(err));
                });
            },
            config: {
                tags: ['web']
            }
        },
        {
            method: 'GET',
            path: '/search',
            handler: function (request, reply) {
                var model = new PageModel({
                    name: pkg.name,
                    version: pkg.version,
                    search: true
                });
                return reply(request.server.app.renderView('page', model));
            },
            config: {
                tags: ['web']
            }
        },
        {
            method: 'GET',
            path: '/favicon.ico',
            handler: function (request, reply) {
                reply.file('public/img/favicon.ico');
            },
            config: {
                tags: ['web']
            }
        },
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                reply().redirect('/dashboard');
            },
            config: {
                tags: ['web']
            }
        },
        {
            method: 'GET',
            path: '/restricted/tests',
            handler: function (request, reply) {
                var model = {
                    name: pkg.name,
                    version: pkg.version,
                    plugins: folders('plugins')
                };
                return reply(request.server.app.renderView('tests', model));
            },
            config: {
                tags: ['web', 'test']
            }
        }
    ]);

    next();
};

exports.register.attributes = {
    pkg: {
        name: 'routes',
        version: '1.0.0',
        description: 'Generic main routes',
        main: 'routes.js'
    }
};
