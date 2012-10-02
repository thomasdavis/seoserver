var fs = require('fs');
var phantom = require('phantom');
var config = {};
var customConfig = process.argv[2];
if(customConfig !== 'null') {
	config = JSON.parse(fs.readFileSync(customConfig, 'utf8'));
};

var child = new (forever.Monitor)(__dirname + '/../lib/server.js', {
	max: 1
});
child.start();

