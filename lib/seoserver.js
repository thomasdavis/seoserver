var express = require('express');
var app = express();
var arguments = process.argv.splice(2);
var port = arguments[0] !== 'undefined' ? arguments[0] : 3000;
var getContent = function(url, callback) {
  var content = '';
  var headers = {};
  var response = {};
  var phantom = require('child_process').spawn('phantomjs', [__dirname + '/phantom-server.js', url]);
  phantom.stdout.setEncoding('utf8');
  phantom.stdout.on('data', function(data) {
    data = data.toString();
    if(match = data.match(/({.*?})\n\n/)) {
      response = JSON.parse(match[1]);
      headers.status = response.status;
      if(response.redirectURL) {
        headers.location = response.redirectURL;
      }
      data = data.replace(/.*?\n\n/, '');
    }
    content += data;
  });
  phantom.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      callback(headers, content);
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
    url = 'http://' + req.headers['x-forwarded-host'] + req.params[0];

  };
  console.log('url:', url);
  getContent(url, function (headers, content) {
    res.status(headers.status);
    if(headers.location) {
      res.set('Location', headers.location);
    }
    if(headers.status >= 200 && headers.status < 300) {
      res.send(content);
    }
    else {
      res.send();
    }
  });
}

app.get(/(.*)/, respond);
app.listen(port);
