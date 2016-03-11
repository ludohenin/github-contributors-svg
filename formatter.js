var sprintf = require('sprintf-js').sprintf;

module.exports = function () {
  return formatter;
};

function formatter(array) {
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
  var svg = buildRows(rows, config);

  var width = config.itemsPerRow * config.blockWidth;
  var height = config.blockHeight * rows.length;

  return sprintf('<svg width="%spx" height="%spx" xmlns="http://www.w3.org/2000/svg" ', width, height) +
                 'xmlns:xlink= "http://www.w3.org/1999/xlink">' +
                 svg +
                 '</svg>';
}

function buildRows(rows, config) {
  var svg = '';

  rows.forEach(function (row, i) {
    row.forEach(function (item, j) {
      var blockX = j * config.blockWidth;
      var blockY = i * config.blockHeight;
      var imgX = j * config.blockWidth + config.imgOffsetLeft;
      var imgY = i * config.blockHeight + config.imgOffsetTop;
      var textX = j * config.textOffsetLeft;
      var textY = (i + 1) * config.textOffsetTop + (i * config.textOffsetAdjustTop);

      svg += sprintf('<a xlink:href="%s">', item.html_url);
      svg += sprintf('<rect x="%s" y="%s" height="%spx" width="%spx" ', blockX, blockY, config.blockHeight, config.blockWidth);
      svg +=         'style="fill:rgba(255,255,255,0);stroke-width:1;stroke:rgb(224,224,224)"/>';
      svg += sprintf('<image xlink:href="%s" x="%s" y="%s" height="%spx" width="%spx"/>', item.avatar_url, imgX, imgY, config.thumbnailHeight, config.thumbnailWidth);
      svg += sprintf('<text x="%s" y="%s" text-anchor="middle" transform="translate(%s)" ', textX, textY, config.textTranslate);
      svg += sprintf('fill="#0275d8" style="font-family:arial;font-size:13px;">%s</text>', item.login);
      svg +=         '</a>';
    });
  });

  return svg;
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
