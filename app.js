const winston = require('winston');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const error = require('./middlewares/errors');
const configureWinston = require('./utils/Winston');
const winstonMongoose = require('./utils/mongoWinston');
const connectMongoose = require('./utils/connectMongoose');
const router = require('./routers/router');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//setting winston and winston-moogoose
configureWinston();
winstonMongoose();

process.on('unhandledRejection', (ex) => {
  throw ex;
});

//connect to mongoose;
connectMongoose();

app.use('/account', router);
app.use(error);

app.listen(port, () => winston.info(`Listening to port: ${port}`));
