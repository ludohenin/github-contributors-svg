var writeFileSync = require('fs').writeFileSync;
var gen = require('./contributors');
var config = require('./config');

var params = {
  params: {
    user: 'ludohenin',
    repo: 'gulp-inline-ng2-template'
  },
  webtaskContext: {
    data: {
      MONGO_URL: config.db.url
    }
  }
};

gen(params, function (err, svg) {
    if (err) console.log(err);

    writeFileSync('debug.html', svg);
    console.log('done');
  });
