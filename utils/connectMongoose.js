const winston = require('winston');
const mongoose = require('mongoose');

function connectMongoose() {
  return mongoose
    .connect('mongodb://localhost/usersAccount')
    .then(() => console.log('Connected to the db. '))
    .catch((err) => console.log(`could not connect to the database , ${err}`));
}

module.exports = connectMongoose;
