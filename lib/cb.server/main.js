// Requires
var http = require('http');
var express = require('express');


function setup(options, imports, register) {
    // Expres app
    var app = express();

    // HtppServer
    var server = http.createServer(app);

    // Register
    register(null, {
        "server": {
            "app": app,
            "http": server
        }
    });
}

// Exports
module.exports = setup;