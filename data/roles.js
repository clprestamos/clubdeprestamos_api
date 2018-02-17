const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const _ = require('lodash');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = 'SELECT roles.id AS role_id, roles.name FROM roles_tb AS roles';
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/roles',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      const columns = `${_.join(_.map(Object.keys(req.payload), key => `"${_.snakeCase(key)}"`), ',')}`;
      const values = _.map(req.payload, value => `'${value}'`);
      const query = `INSERT INTO roles_tb (${columns}) VALUES (${_.join(values, ',')}) RETURNING *`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/roles',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
