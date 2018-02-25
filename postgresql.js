/* eslint-disable consistent-return, no-console*/
const pg = require('pg');
const _ = require('lodash');
const pgConfig = require('./pg_config.js');
const logger = require('./logger.js');

const Postgresql = (query, cb) => {
  const pool = new pg.Pool(pgConfig);
  pool.connect((err, client, done) => {
    if (err) {
      logger.error(`${new Date()} CONNECTION ERROR: ${err}`);
    }
    logger.log('================= QUERY =================');
    console.log('================= QUERY =================');
    logger.log(query);
    console.log(query);
    logger.log('=========================================');
    console.log('=========================================');
    client.query(query, (queryError, result) => {
      if (queryError) {
        cb(queryError, {});
        return logger.error(`${new Date()} QUERY ERROR: ${queryError}`);
      }
      cb(null, _.map(result.rows, row => _.mapKeys(row, (v, k) => _.camelCase(k))));
      done();
    });
  });
  pool.on('error', (err, client) => {
    logger.error(new Date(), 'idle client error', err.message, err.stack, client);
  });
  pool.end(() => {
    logger.log('CONNECTION CLOSED', new Date());
  });
};

module.exports = Postgresql;
