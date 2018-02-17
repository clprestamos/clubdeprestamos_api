const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info',
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
    }),
  ],
});

// logger.stream({ start: -1 }).on('log', (log) => {
//   console.log(log);
// });

module.exports = logger;
