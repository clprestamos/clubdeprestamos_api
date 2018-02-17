const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  patch: {
    202: (req, res, callback) => {
      let request = '';
      _.mapKeys(req.payload, (v, k) => {
        if (k !== 'id') {
          request += `"${_.snakeCase(k)}"='${v}' `;
        }
      });
      const query =
        `UPDATE support_documents_tb SET ${request} WHERE id=${req.payload.id} RETURNING *`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/documents/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
                      .field('d.id')
                      .field('d.user_id')
                      .field('d.file_name')
                      .field('d.dowload_link')
                      .field('d.type_id')
                      .field('u.name')
                      .field('u.last_name')
                      .from('documents_tb', 'd')
                      .join('users_tb', 'u',
                        squelPg.expr()
                          .and('u.id = d.user_id')
                      )
                      .where('d.id = ?', req.params.id)
                      .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/documents/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
