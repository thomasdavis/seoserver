var page = require('webpage').create(),
    system = require('system'),
    config = require('../bin/config'),
    lastReceived = new Date().getTime(),
    requestCount = 0,
    responseCount = 0,
    requestIds = [],
    checkComplete,
    checkCompleteInterval;

page.viewportSize = {width: 1024, height: 768};
page.onResourceRequested = function(request) {
    if (requestIds.indexOf(request.id) === -1) {
        if (config.verbose) {
            console.log('Requested: ' + request.id + ' ' + request.method + ' ' + request.url);
        }
        requestIds.push(request.id);
        requestCount++;
    }
};
page.onResourceReceived = function(response) {
    if (requestIds.indexOf(response.id) !== -1) {
        if (config.verbose) {
            console.log('Received: ' + response.id + ' ' +
                response.contentType + ' ' +
                response.url + ' ' +
                response.bodySize + ' ' +
                response.stage + ' ' +
                response.status + ' ' +
                response.statusText + ' ' +
                response.redirectURL
            );
        }
        lastReceived = new Date().getTime();
        responseCount++;
        requestIds[requestIds.indexOf(response.id)] = null;
    }
};

checkComplete = function () {
    var timeDiff = new Date().getTime() - lastReceived;
    if (timeDiff > config.checkCompleteTimeDiff && requestCount === responseCount) {
        clearInterval(checkCompleteInterval);
        console.log(page.content);
        phantom.exit();
    } else {
        if (timeDiff > config.checkCompleteTimeout) {
            if (requestCount !== responseCount) {
                console.log(
                    'requestCount: ' + requestCount +
                    ' !== responseCount: ' + responseCount + '.' +
                    ' You might have a synchronous ajax call that is NOT being captured by onResourceReceived.' +
                    ' See: https://github.com/ariya/phantomjs/issues/11284'
                );
            }
            console.log('FORCED EXIT STATUS 1. Incomplete in ' + timeDiff + ' seconds.');
            phantom.exit(1);
        }
    }
};

page.open(system.args[1], function () {});
checkCompleteInterval = setInterval(checkComplete, config.checkCompleteInterval);
