var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');


function accept(req, res) {

  if (req.url == '/refresh') {
    req.on('data', function (chunk) {
      var fs = require('fs');
      fs.writeFile('offers.json', chunk, function (err) {
        if (err) {
        return console.log(err)}
      });
      res.end(chunk);
    });
  } else {
    file.serve(req, res);
  }
}

if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}
