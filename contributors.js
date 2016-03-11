var contributors = require('github-contributors-list/lib/contributors');
var formatter = require('./formatter');

var options = {};
options.filter = [];


module.exports = getContributors;


function getContributors(params) {
  options.user = params.user;
  options.repo = params.repo;
  options.strategy = formatter();

  return contributors(options).get()
    .then(function (svg) {
      return svg;
    });
}
