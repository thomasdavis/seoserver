#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    forever = require('forever-monitor'),
    config = require('./config');

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
        console.log('With config: ', JSON.stringify(config, null, 4));
    });

program.parse(process.argv);
