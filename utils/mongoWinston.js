const winston = require('winston');
require('winston-mongodb');

function winstonMongoose() {
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/users',
      collection: 'logs',
      level: 'error',
    })
  );
  return winston;
}

module.exports = winstonMongoose;
