var express = require('express');
var Webtask = require('webtask-tools');
var getContributors = require('./contributors');

var server = express();


server.get('/:user/:repo.:ext', function (req, res) {
  getContributors(req, function (err, svg) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml'});
      res.end(svg);
    });
});


module.exports = Webtask.fromExpress(server);
