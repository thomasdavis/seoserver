var page = require('webpage').create();
var system = require('system');

var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var requestIds = [];

var initialResponse = null;

page.onResourceReceived = function (response) {
    initialResponse = initialResponse || response;
    if(requestIds.indexOf(response.id) !== -1) {
        lastReceived = new Date().getTime();
        responseCount++;
        requestIds[requestIds.indexOf(response.id)] = null;
    }
};
page.onResourceRequested = function (request) {
    if(requestIds.indexOf(request.id) === -1) {
        requestIds.push(request.id);
        requestCount++;
    }
};

page.open(system.args[1], function () {

});

var checkComplete = function () {
  if(new Date().getTime() - lastReceived > 300 && requestCount === responseCount)  {
    clearInterval(checkCompleteInterval);
    console.log(JSON.stringify(initialResponse) + "\n\n");
    console.log(page.content);
    phantom.exit();
  } else {
  }
}
var checkCompleteInterval = setInterval(checkComplete, 1);
