#!/usr/bin/env node



var program = require('commander');
var fs = require('fs');
var forever = require('forever-monitor');

// require our seoserver npm package

program
  .version('0.0.1')
  .option('-c, --config <location>', 'Specifiy a config location, leave blank for defaults')
  .option('-s, --stop', 'Stop the currently running SeoServer')
  .parse(process.argv);

if (program.config) {
	var config = JSON.parse(fs.readFileSync(program.config, 'utf8'));
	if(typeof config.forever !== 'undefined') {
		forever.load(config.forever);
	}
};

if(program.stop) {
	forever.stop('seoserver');
	console.log('SeoServer has been stopped');
} else {
  var child = new (forever.Monitor)(__dirname + '/../lib/test.js', {
  uid: 'seoserver', options: [program.config]
  });
child.start();
	console.log(__dirname, 'SeoServer successfully started, `seoserver -s` to stop it');
}
