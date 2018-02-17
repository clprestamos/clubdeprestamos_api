const Mockgen = require('../../mockgen.js');
const pg = require('../../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
                      .field('d.id')
                      .field('d.user_id')
                      .field('d.file_name')
                      .field('d.dowload_link')
                      .field('d.type_id')
                      .from('documents_tb', 'd')
                      .join('users_tb', 'u',
                        squelPg.expr()
                          .and('u.id = d.user_id')
                      )
                      .where('d.user_id = ?', req.params.id)
                      .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/documents/user/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
