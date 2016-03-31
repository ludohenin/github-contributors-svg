var async = require('async');
var deferred = require('deferred');
var request = require('request');
var sprintf = require('sprintf-js').sprintf;

module.exports = formatter;

function formatter(array) {
  var def = deferred();
  var config = {
    itemsPerRow: 6,
    blockWidth: 140,
    blockHeight: 160,
    thumbnailWidth: 120,
    thumbnailHeight: 120,
    imgOffsetLeft: 10,
    imgOffsetTop: 10,
    textTranslate: 140/2,
    textOffsetLeft: 140,
    textOffsetTop: 150,
    textOffsetAdjustTop: 10
  };

  var rows = groupByRows(array, config.itemsPerRow);

  var width = config.itemsPerRow * config.blockWidth;
  var height = config.blockHeight * rows.length;

  async.parallel(
    buildRows(rows, config),
    function (err, result) {
      if (err) return def.reject(err);

      var svg = result.join('\n');
      var res = sprintf('<svg width="%spx" height="%spx" xmlns="http://www.w3.org/2000/svg" ', width, height) +
                        'xmlns:xlink= "http://www.w3.org/1999/xlink">' +
                        svg +
                        '</svg>';

      def.resolve(res);
    });

  return def.promise;
}

function buildRows(rows, config) {
  var asyncCalls = [];

  rows.forEach(function (row, i) {
    row.forEach(function (item, j) {
      asyncCalls.push(function (cb) {
        request(item.avatar_url + '&s=' + config.thumbnailWidth, { encoding: null }, function (err, response, body) {
          var img;
          if (!err && response.statusCode == 200) {
            var base64Img = body.toString('base64');
            img = 'data:' + response.headers["content-type"] + ';base64,' + base64Img;
            return cb(null, buildCell(config, item, i, j, img));
          }
          return cb(err);
        });
      });
    });
  });

  return asyncCalls;
}

function buildCell(config, item, i, j, img) {
  var blockX = j * config.blockWidth;
  var blockY = i * config.blockHeight;
  var imgX   = j * config.blockWidth + config.imgOffsetLeft;
  var imgY   = i * config.blockHeight + config.imgOffsetTop;
  var textX  = j * config.textOffsetLeft;
  var textY  = (i + 1) * config.textOffsetTop + (i * config.textOffsetAdjustTop);
  var cell = '';

  cell += sprintf('<a xlink:href="%s">', item.html_url);
  cell += sprintf('<rect x="%s" y="%s" height="%spx" width="%spx" ', blockX, blockY, config.blockHeight, config.blockWidth);
  cell +=         'style="fill:rgba(255,255,255,0);stroke-width:1;stroke:rgb(224,224,224)"/>';
  cell += sprintf('<image xlink:href="%s" x="%s" y="%s" height="%spx" width="%spx"/>', img, imgX, imgY, config.thumbnailHeight, config.thumbnailWidth);
  cell += sprintf('<text x="%s" y="%s" text-anchor="middle" transform="translate(%s)" ', textX, textY, config.textTranslate);
  cell += sprintf('fill="#0275d8" style="font-family:arial;font-size:13px;">%s</text>', item.login);
  cell +=         '</a>';

  return cell;
}

function groupByRows(items, itemsPerRow) {
  var rows = [];
  var counter = 0;
  var row;
  items.forEach(function (item) {
    if (!row) { row = []; }
    row.push(item);
    counter++;

    if (counter === itemsPerRow) {
      rows.push(row);
      row = null;
      counter = 0;
    }
  });
  return rows;
}
