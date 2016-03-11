var fs = require('fs');
var CloudConvert = require('cloudconvert');
var contributors = require('github-contributors-list/lib/contributors');
var table = require('github-contributors-list/lib/strategies/table');
var marked = require('marked');
var request = require('request');
var express = require('express');
var Webtask = require('webtask-tools');
var getContributors = require('./contributors');

var server = express();
var options = {};
options.filter = [];


server.get('/:user/:repo.:ext', function (req, res) {
  getContributors(req.params)
    .then(function (svg) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml'});
      res.end(svg);
    });
});


module.exports = Webtask.fromExpress(server);
