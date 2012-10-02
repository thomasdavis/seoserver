var str_phantom_output = '';
var yourfunc = function() {
  var phantom = require('child_process').spawn('phantomjs', ['blue.js']);
  phantom.stdout.setEncoding('utf8');
  phantom.stdout.on('data', function(data) {
    //parse or echo data
    str_phantom_output += data.toString();
    // The above will get triggered one or more times, so you'll need to
    // add code to parse for whatever info you're expecting from the browser
  });
  phantom.stderr.on('data', function(data) {
    // do something with error data
  });
  phantom.on('exit', function(code) {
    console.log('finishd', code, str_phantom_output);
    if (code !== 0) {
      // console.log('phantomjs exited with code ' +code);
    } else {
      // clean exit: do something else such as a passed-in callback
    }
  });
}
yourfunc();