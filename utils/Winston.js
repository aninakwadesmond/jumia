const winston = require('winston');

function configureWinston() {
  return winston.configure({
    transports: [
      new winston.transports.Console({
        name: 'console',
        colorize: true,
        prettyPrint: true,
        level: 'error',
      }),
      new winston.transports.File({
        name: 'error-file',
        filename: 'Errors.log',
        level: 'error',
      }),
      new winston.transports.File({
        name: 'console-file',
        filename: 'console.log',
        level: 'info',
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        name: 'exception-file',
        filename: 'exception.log',
        level: 'info',
      }),
    ],
  });
}

module.exports = configureWinston;
