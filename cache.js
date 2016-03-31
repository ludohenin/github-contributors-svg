var MongoClient = require('mongodb').MongoClient;

var COLLECTION_NAME = 'contributors';
var EXPIRE = 0; // 24 hours

module.exports = {
  get: getFromMongo,
  set: saveToMongo
};

function getFromMongo(options, cb) {
  MongoClient.connect(options.db, function get(err, db) {
    db.collection(COLLECTION_NAME).findOne({ key: options.key }, function(err, result) {
      if (err) return cb(err);
      db.close();

      if (result) {
        var isCacheValid = (Date.now() - result.created_at < EXPIRE);
        if (isCacheValid) return cb(null, result.svg);

        return removeFromMongo(options, result, function () {
          cb(null, null);
        });
      }

      cb(null, null);
    });
  });
}

function saveToMongo(options, model, cb) {
  MongoClient.connect(options.db, function get(err, db) {
    db.collection(COLLECTION_NAME).insertOne(model, function(err, result) {
      if (err) return cb(err);
      cb(null, model.svg);

      db.close();
    });
  });
}

function removeFromMongo(options, model, cb) {
  MongoClient.connect(options.db, function get(err, db) {
    db.collection(COLLECTION_NAME).deleteOne(model, function(err, result) {
      if (err) return cb(err);
      cb(null);

      db.close();
    });
  });
}
