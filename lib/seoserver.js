var fs = require('fs');
var phantom = require('phantom');
var config = {};
var customConfig = process.argv[2];
if(customConfig !== 'null') {
	config = JSON.parse(fs.readFileSync(customConfig, 'utf8'));
};






	var blahg;

function respond(req, res, next) {
	var url = config.url || req.headers['x-forwarded-host'];
	var waitTime = 300;



	var openPage = function(page) {
		var onOpened = function (status) {
		var ajaxTimer = new Date().getTime();

			var checkActive = function (result) {
				console.log(arguments);
				if(result === 0 && new Date().getTime() > ajaxTimer + waitTime) {
	      		console.log('send output');
			   		clearInterval(activeChecker);
			page.evaluate((function() {
					        return document.documentElement.outerHTML;
					      }), function(resulta) {
									res.send(resulta);
					      //  console.log(resulta);
					      });
	      	} else {

	      	}
	      	if(result === null) {
	      		clearInterval(activeChecker);
	      		res.send('error');
	      	}
	      	if(result === 1) {
	      		ajaxTimer = new Date().getTime();

	      	}
			}
			console.log("THIS ONLY RUNS ONCE", url + req.url);
			var activeChecker = setInterval( function () {
				page.evaluate(function() { return window.$.active; }, checkActive);
			}, 10);
		};
		page.open(url + req.url, onOpened);
	}
	var createPage = function(ph) {
		ph.createPage(openPage);
	};
	phantom.create(createPage);
/*

	phantom.create(function(ph) {
	  return ph.createPage(function(page) {
	    return page.open(url + req.url, function(status) {
	     blahg =  setInterval(function () {
	     	console.log(blahg);
	      page.evaluate((function() {
	        return window.$.active;
	      }), function(result) {
	      	if(result === 0 && new Date().getTime() > ajaxTimer + waitTime) {
	      	//	console.log('send output');
			   		clearInterval(blahg);
		  				page.evaluate((function() {
					        return document.documentElement.outerHTML;
					      }), function(resulta) {
									res.send(resulta);
					      //  console.log(resulta);
					        ph.exit();
					      });

	      	} else {

	      	}
	      	if(result === 1) {
	      		ajaxTimer = new Date().getTime();

	      	}
	      //  console.log(result);
	      });
	      }, 200);




	      return page.evaluate((function() {
	        return document.documentElement.outerHTML;
	      }), function(result) {
	res.send(result);
	        console.log(result);
	        return ph.exit();
	      });






  page.evaluate((function() {
			        return document.documentElement.outerHTML;
			      }), function(resulta) {
							res.send(resulta);
			        console.log(resulta);
			        ph.exit();
			      });



	    });
	  });
	});
	
*/
};
var express = require('express');
var app = express();
app.get(/(.*)/, respond);
app.listen(3000);