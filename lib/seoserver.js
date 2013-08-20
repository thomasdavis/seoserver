var express = require('express'),
    app = express(),
    args = process.argv.splice(2),
    port = args[0] !== 'undefined' ? args[0] : 3000,
    getContent,
    respond;

getContent = function(url, callback) {
    var content = '',
        phantom = require('child_process').spawn('phantomjs', [__dirname + '/phantom-server.js', url]);
    phantom.stdout.setEncoding('utf8');
    phantom.stdout.on('data', function(data) {
        console.log('seoserver:PhantomJS stdout: ' + data);
        content += data.toString();
    });
    phantom.stderr.on('data', function(data) {
        console.log('seoserver:PhantomJS stderr: ' + data);
    });
    phantom.on('exit', function(code) {
        if (code !== 0) {
            console.log('seoserver:PhantomJS Exited with code: ' + code);
        } else {
            console.log('seoserver:PhantomJS Exited Successfully. Calling callback with content: ' + content);
            callback(content);
        }
    });
};

respond = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var url;
    if (req.headers.referer) {
        url = req.headers.referer;
        console.log('seoserver:url:req.headers.referer:', url);
    }
    if (req.headers['x-forwarded-host']) {
        url = 'http://' + req.headers['x-forwarded-host'] + req.params[0];
        console.log('seoserver:url:req.headers.x-forwarded-host:', url);
    }
    console.log('seoserver:url:', url);
    getContent(url, function(content) {
        res.send(content);
    });
};

app.get(/(.*)/, respond);
app.listen(port);
