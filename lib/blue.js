var page = require('webpage').create();
var startTime = new Date().getTime();
var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var urls = [];
page.onResourceReceived = function (response) {
    //console.log(urls, response.url);
    if(urls.indexOf(response.id) !== -1) {
       // console.log(JSON.stringify(response.url, undefined, 4));
        lastReceived = new Date().getTime();
        responseCount++;
        urls[urls.indexOf(response.id)] = null;
    }
    //console.log(urls.indexOf(response.id), 'HUH', urls, response.id);
    //console.log(response);
    //console.log('Receive ' + JSON.stringify(response, undefined, 4));
};
page.onResourceRequested = function (request) {
    if(urls.indexOf(request.id) === -1) {
        //console.log(JSON.stringify(request, undefined, 4));
        urls.push(request.id);
        requestCount++;
    }
   // console.log(JSON.stringify(request.url, undefined, 4));
};
page.open('http://localhost/repos/apiengine-client/thomasdavis/ApiEngine/version/1/resource/9/DELETE', function () {

});

var checkComplete = function () {
  if(new Date().getTime() - lastReceived > 300 && requestCount === responseCount)  {
    var timeTaken = (new Date().getTime() - startTime) /1000;
    clearInterval(checkCompleteInterval);
    console.log(page.content);
    phantom.exit();
  } else {
  }
}
var checkCompleteInterval = setInterval(checkComplete, 1);