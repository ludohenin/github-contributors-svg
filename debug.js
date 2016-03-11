var gen = require('./contributors');

var params = {
  user: 'mgechev',
  repo: 'angular2-seed'
};

gen(params)
  .then(function (svg) {
    console.log(svg);
  });