var page = require('webpage').create(),
    system = require('system'),
    lastReceived = new Date().getTime(),
    requestCount = 0,
    responseCount = 0,
    requestIds = [],
    checkComplete,
    checkCompleteInterval;

page.viewportSize = {width: 1024, height: 768};
page.onResourceRequested = function(request) {
    if (requestIds.indexOf(request.id) === -1) {
        requestIds.push(request.id);
        requestCount++;
        console.log('phantom-server:onResourceRequested: request.id: ' + request.id + ' requestCount: ' + requestCount + ' requestIds: ' + requestIds);
    } else {
        console.log('phantom-server:onResourceRequested: request.id: ' + request.id + ' requestIds: ' + requestIds);
    }
};
page.onResourceReceived = function(response) {
    if (requestIds.indexOf(response.id) !== -1) {
        lastReceived = new Date().getTime();
        responseCount++;
        requestIds[requestIds.indexOf(response.id)] = null;
        console.log('phantom-server:onResourceReceived: lastReceived: ' + lastReceived + ' responseCount: ' + responseCount + ' requestIds: ' + requestIds);
    } else {
        console.log('phantom-server:onResourceReceived: response.id: ' + response.id + ' requestIds: ' + requestIds);
    }
};

checkComplete = function () {
    var timeDiff = new Date().getTime() - lastReceived;
    console.log('phantom-server:checkComplete: ' + timeDiff + ' requestCount: ' + requestCount + ' responseCount: ' + responseCount);
    if (timeDiff > 300 && requestCount === responseCount) {
        console.log('phantom-server:checkComplete: Complete. timeDiff: ' + timeDiff);
        clearInterval(checkCompleteInterval);
        console.log(page.content);
        phantom.exit();
    } else {
        console.log('phantom-server:checkComplete: Incomplete... timeDiff: ' + timeDiff);
    }
};

page.open(system.args[1], function () {});
checkCompleteInterval = setInterval(checkComplete, 1000);
