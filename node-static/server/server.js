var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');

function accept(req, res) {

  switch (req.url) {
    case '/refresh':
      req.on('data', function (chunk) {
        var fs = require('fs');
        var dd = fs.writeFile('offers.json', chunk, function (err) {
          if (err) {
            console.log(err);
          } else {
            res.end(chunk);
          }
        });
      });
      break;
    case '/getUser':
      req.on('data', function (chunk) {
        var fs = require('fs');
        var dd = fs.readFile('user.json', function (err, content) {
          $.each(JSON.parse(content), function (i) {
            if (this.id == chunk) {
              res.end(this);
            }
          })
        })
      });
      break;
    default:
      file.serve(req, res);
      break;
  }

  if (req.url == '/refresh') {
    req.on('data', function (chunk) {
      var fs = require('fs');
      var dd = fs.writeFile('offers.json', chunk, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.end(chunk);
        }
      });
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
