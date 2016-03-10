"use strict";

const hapi = require('hapi');
const server = new hapi.Server();
const boom = require('boom');
const dust = require('dustjs-linkedin');
dust.helpers = require('dustjs-helpers');
const plugins = require('./plugins.js');
// Set default ports
process.env.PORT = process.env.PORT || 8000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Create connection
server.connection({
    port: process.env.PORT,
    host: process.env.IP,
    compression: true,
    labels: ['web', 'isomorphic', 'responsive', 'demo'],
    router: {
        stripTrailingSlash: true
    },
    routes: {
        cors: true,
        validate: {
            options: {
                allowUnknown: true
            }
        }
    }
});

// Register plugins
server.register(plugins, function(loadError) {
    if (loadError) {
        console.error('Failed to load a plugin:', loadError);
        process.exit(1);
    } else {
        var dustViews = require("fs").readFileSync("./lib/views.min.js");
        dust.loadSource(dustViews);
        console.log('Views loaded to cache');
        // Start server
        server.start(function (startError) {
            if (startError) {
                console.error(startError);
                process.exit(1);
            }
            // Log event
            console.log('Server running at ' + server.info.uri);
        });
    }
});

// Register rendering method for views
server.app.renderView = function renderView (view, model) {
    return new Promise(function (resolve, reject) {
        model = model || {};
        model.debug = (process.env.NODE_ENV === 'development');
        dust.render(view.toLowerCase().indexOf('.dust') === -1 ? (view + '.dust') : view, model, function (err, out) {
            if (err !== null) {
                reject(boom.badRequest(err.message));
            } else {
                resolve(out);
            }
        });
    });
};