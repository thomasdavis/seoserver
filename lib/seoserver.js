var fs = require('fs');
var phantom = require('phantom');
var config = {};
var customConfig = process.argv[2];
if(customConfig) {
	config = JSON.parse(fs.readFileSync(customConfig, 'utf8'));
};
function respond(req, res, next) {
	var url = config.url || req.host;

	
	phantom.create(function(ph) {
	  return ph.createPage(function(page) {
	    return page.open(url + req.url, function(status) {
	      console.log("opened google? ", status);
	      return page.evaluate((function() {
	        return document.documentElement.outerHTML;
	      }), function(result) {
	res.send(result);
	        console.log(result);
	        return ph.exit();
	      });
	    });
	  });
	});
	
};
var express = require('express');
var app = express();
app.get(/(.*)/, respond);
app.listen(3000);