const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
                      .field('d.id')
                      .field('d.file_name')
                      .field('d.dowload_link')
                      .field('d.user_id')
                      .field('u.id')
                      .field('u.name', 'user_name')
                      .field('u.last_name')
                      .from('documents_tb', 'd')
                      .from('users_tb', 'u')
                      .where('d.user_id = u.id')
                      .toString();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/documents',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
