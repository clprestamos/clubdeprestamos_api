const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');

module.exports = {
  patch: {
    202: (req, res, callback) => {
      let request = '';
      _.mapKeys(req.payload, (v, k) => {
        if (k !== 'id') {
          request += `"${_.snakeCase(k)}"='${v}' `;
        } else if (k === 'roleId') {
          request += `"${_.snakeCase(k)}"=${v} `;
        }
      });
      const query =
        `UPDATE roles_tb SET ${request} WHERE id=${req.payload.id} RETURNING *`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/roles/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
    200: (req, res, callback) => {
      let id = 0;
      if (_.isEmpty(req.query)) {
        id = _.last(_.split(req.path, '/roles/'));
      } else {
        id = req.query.id;
      }
      const query = `SELECT * FROM roles_tb WHERE id = ${id}`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/roles/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
