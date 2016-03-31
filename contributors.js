var waterfall = require('async').waterfall;
var cache = require('./cache');
var contributors = require('github-contributors-list/lib/contributors');
var formatter = require('./formatter');

var cacheSvg = false;
var options = {};
options.filter = [];


module.exports = getContributors;


function getContributors(req, cb) {
  var params = req.params;
  var DB_URL = req.webtaskContext.data.MONGO_URL;
  var db_options = {
    db: DB_URL,
    key: params.user + '/' + params.repo
  };

  options.user = params.user;
  options.repo = params.repo;
  options.strategy = formatter;


  waterfall([
    getContribFromCache(db_options),
    getContribFromGithub(options),
    saveContribToCache(db_options)
  ], cb);
}


function getContribFromCache(options) {
  return function (cb) {
    cache.get(options, cb);
  }
}

function getContribFromGithub(options) {
  return function (svg, cb) {
    if (svg) return cb(null, svg);
    cacheSvg = true;

    contributors(options).get()
      .then(function (svg) {
        cb(null, svg);
      })
      .catch(function (err) {
        cb(err);
      });
  }
}

function saveContribToCache(options) {
  return function (svg, cb) {
    if (!cacheSvg) return cb(null, svg);

    cache.set(options, {
        key: options.key,
        svg: svg,
        created_at: Date.now()
      }, cb);
  }
}