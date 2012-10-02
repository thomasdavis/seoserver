var phantom = require('phantom');

phantom.create(function(ph) {
	  return ph.createPage(function(page) {
	    return page.open('http://app.apiengine.io', function(status) {
	    	setTimeout(function() {
		      page.evaluate((function() {
		        return document.documentElement.outerHTML;
		      }), function(result) {
		      	console.log(result);
		      });
	    	}, 3000);
	      console.log("opened google? ", status);

	    });
	  });
	});