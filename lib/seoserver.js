var express = require('express');
var app = express();


var getContent = function(url, callback) {
  var content = '';
  var phantom = require('child_process').spawn('phantomjs', [__dirname + '/phantom-server.js', url]);
  phantom.stdout.setEncoding('utf8');
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      callback(content);
    }
  });
};

var respond = function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var url;
  if(req.headers.referer) {
    url = req.headers.referer;
  }
  if(req.headers['x-forwarded-host']) {
    url = req.headers['x-forwarded-host'] + req.params[0];

  };
  console.log('url:', url);
  getContent(url, function (content) {
    res.send(content);
  });
}

app.get(/(.*)/, respond);
app.listen(3000);