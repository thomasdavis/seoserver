#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    forever = require('forever-monitor');

// require our seoserver npm package

program
    .version('0.0.1')
    .option('-p, --port <location>', 'Specifiy a port to run on');

program
    .command('start')
    .description('Starts up an SeoServer on default port 3000')
    .action(function() {
        var child = new (forever.Monitor)(__dirname + '/../lib/seoserver.js', {
            options: [program.port]
        });
        child.start();
        console.log(__dirname, 'SeoServer successfully started');
    });

program
    .command('stop')
    .description('Stops the SeoServer')
    .action(function() {
        console.log(__dirname, 'SeoServer stop stub. What should this do?');
    });

program.parse(process.argv);
